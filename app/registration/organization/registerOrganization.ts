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

      // Insert the user profile with the 'admin' role
      await trx.insert( userProfiles ).values( {
        userId,
        orgId: org.id,
        organizationName: orgName,
        role: 'admin', // Mark the first registered user as an admin
      } );

      // Update the user's role in auth.users table
      const { error: roleError } = await supabase.from( 'auth.users' )
        .update( { role: 'admin' } )
        .eq( 'id', userId );

      if ( roleError )
      {
        throw new Error( 'Could not update user role: ' + roleError.message );
      }
    } );

    console.log( 'Organization registered successfully.' );
    return { success: true, orgName: orgName };
  } catch ( error )
  {
    console.log( 'Error during registration:', error );
    return { success: false, message: error || 'Could not complete registration' };
  }
};