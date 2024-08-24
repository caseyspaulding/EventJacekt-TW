'use server';

import { db } from '@/db';
import { organizations, userProfiles } from '@/db/schema';
import { createClient } from '@/utils/supabase/server';
import { eq } from 'drizzle-orm';

export const registerOrganization = async ( formData: FormData ) =>
{
  const orgName = formData.get( 'orgName' ) as string;
  const website = formData.get( 'website' ) as string;
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
      return { success: false, message: 'Organization already exists' };
    }

    // Use a transaction for organization and user profile creation
    await db.transaction( async ( trx ) =>
    {
      // Step 1: Create organization
      const [ org ] = await trx
        .insert( organizations )
        .values( { name: orgName, website } )
        .returning( { id: organizations.id } );

      if ( !org )
      {
        throw new Error( 'Could not create organization' );
      }

      // Step 2: Create user profile
      await trx.insert( userProfiles ).values( {
        userId,
        orgId: org.id,
        organizationName: orgName,
      } );
    } );

    console.log( 'Organization registered successfully.' );
    return { success: true, orgName: orgName };
  } catch ( error )
  {
    console.error( 'Error during registration:', error );
    return { success: false, message: 'Could not complete registration' };
  }
};
