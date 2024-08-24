'use server';

import { db } from '@/db';
import { organizations, userProfiles } from '@/db/schema';


export const registerOrganization = async ( formData: FormData ) =>
{
  const userId = formData.get( 'userId' ) as string; // Ensure you get the user ID from context or session
  const orgName = formData.get( 'orgName' ) as string;
  const website = formData.get( 'website' ) as string;

  // Input validation
  if ( !orgName )
  {
    return { success: false, message: 'Organization name is required' };
  }

  try
  {
    // Create organization and user profile
    await db.transaction( async ( trx ) =>
    {
      const [ org ] = await trx.insert( organizations ).values( { name: orgName, website } ).returning( { id: organizations.id } );

      if ( !org )
      {
        throw new Error( 'Could not create organization' );
      }

      await trx.insert( userProfiles ).values( {
        userId,
        orgId: org.id,
        organizationName: orgName,
        role: 'admin', // Assign admin role for org creators
      } );
    } );

    return { success: true, message: 'Organization registration complete!' };
  } catch ( error )
  {
    console.error( 'Error during organization registration:', error );
    return { success: false, message: 'Could not complete registration' };
  }
};
