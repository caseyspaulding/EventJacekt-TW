import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { organizations } from '@/db/schema';
import { StripeDataUpdates } from '@/types/stripeTypes';


// Update organization with Stripe data
export async function updateOrganizationWithStripeData (
  decodedOrgName: string,
  updates: StripeDataUpdates
)
{
  try
  {
    console.log( 'Updating organization:', decodedOrgName );
    console.log( 'Update payload:', updates );


    // Fetch the organization ID using the name
    const orgId = await getOrgIdByName( decodedOrgName );

    

    // Only proceed with the update if there are fields to update
    if ( Object.keys( updates ).length > 0 )
    {
      const updateResult = await db
        .update( organizations )
        .set( updates )
        .where( eq( organizations.id, orgId ) )
        .returning();

      if ( updateResult.length === 0 )
      {
        throw new Error( 'Organization not found' );
      }
      console.log( 'Update successful:', updateResult );
      return updateResult[ 0 ];
    }
  } catch ( error )
  {
    console.error( 'Error updating organization:', error );
    throw new Error( 'Failed to update organization' );
  }
}

// Fetch organization ID by name
async function getOrgIdByName ( orgName: string )
{
  const result = await db
    .select( { id: organizations.id } )
    .from( organizations )
    .where( eq( organizations.name, orgName ) )
    .limit( 1 );

  if ( result.length === 0 )
  {
    throw new Error( 'Organization not found' );
  }

  return result[ 0 ].id;
}


// Fetch organization by ID
export async function getOrganizationById ( orgId: string )
{
  return await db
    .select()
    .from( organizations )
    .where( eq( organizations.id, orgId ) )
    .limit( 1 );
}

// Create a new organization
export async function createOrganization ( data: typeof organizations.$inferInsert )
{
  return await db
    .insert( organizations )
    .values( data )
    .returning();
}