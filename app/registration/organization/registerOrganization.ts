'use server';

import { db } from '@/db';
import { organizations, userProfiles } from '@/db/schema';
import { createClient } from '@/utils/supabase/server';
import { eq } from 'drizzle-orm';


export const registerOrganization = async ( formData: FormData ) =>
{
  const orgName = formData.get( 'orgName' ) as string;
  const website = formData.get( 'website' ) as string;
  const logoFile = formData.get( 'logo' ) as File;
  const supabase = createClient();

  // Get the authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if ( authError || !user )
  {
    console.error( 'Authentication error:', authError );
    return { success: false, message: 'User not authenticated' };
  }

  const userId = user.id;

  try
  {
    // Check if the organization already exists
    const existingOrgs = await db
      .select()
      .from( organizations )
      .where( eq( organizations.name, orgName ) );

    if ( existingOrgs.length > 0 )
    {
      console.log( 'Organization already exists' );
      return { success: false, message: 'Organization already exists' };
    }

    // Handle image upload
    let logoUrl = '';
    if ( logoFile )
    {
      const { error: uploadError } = await supabase.storage
        .from( 'blogimages' ) // Replace with your actual bucket name
        .upload( `public/${ logoFile.name }`, logoFile, {
          cacheControl: '3600',
          upsert: false,
        } );

      if ( uploadError )
      {
        console.error( 'Error uploading logo:', uploadError.message );
        return { success: false, message: 'Error uploading logo' };
      }

      const { data: publicUrlData } = supabase.storage
        .from( 'blogimages' )
        .getPublicUrl( `public/${ logoFile.name }` );

      if ( !publicUrlData )
      {
        console.error( 'Error retrieving public URL for logo' );
        return { success: false, message: 'Error retrieving logo URL' };
      }

      logoUrl = publicUrlData.publicUrl;
    }

    // Use a transaction for organization and user profile creation
    try
    {
      await db.transaction( async ( trx ) =>
      {
        const [ org ] = await trx
          .insert( organizations )
          .values( { name: orgName, website, logoUrl } )
          .returning( { id: organizations.id } );

        if ( !org )
        {
          console.log( 'Organization is not set' );
          throw new Error( 'Could not create organization' );
        }

        await trx.insert( userProfiles ).values( {
          userId,
          orgId: org.id,
          organizationName: orgName,
          role: 'admin',
        } );
      } );

      console.log( 'Organization registered successfully.' );

      // Introduce a delay before returning success
      await new Promise( ( resolve ) => setTimeout( resolve, 2000 ) ); // Delay for 1 second

      return { success: true, orgName: orgName };
    } catch ( error )
    {
      console.log( 'Error during registration transaction:', error );
      return { success: false, message: 'Could not complete registration' };
    }
  } catch ( error )
  {
    console.log( 'Error during registration:', error );
    return { success: false, message: 'Could not complete registration' };
  }
};
