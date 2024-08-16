'use server';

import { updateOrganizationWithStripeData } from '@/db/dataAccess/orgs';
import { revalidatePath } from 'next/cache';
import { StripeDataUpdates } from '@/types/stripeTypes';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { organizations } from '@/db/schema';

export async function updateOrganizationStripeData (
  decodedOrgName: string,
  stripeData: StripeDataUpdates
)
{
  try
  {
    // Fetch the organization by name
    const orgId = await getOrgIdByName( decodedOrgName );

    // Update each field explicitly
    if ( stripeData.stripeConnectAccountId )
    {
      await db
        .update( organizations )
        .set( { stripeConnectAccountId: stripeData.stripeConnectAccountId } )
        .where( eq( organizations.id, orgId ) );
    }

    if ( stripeData.stripeConnectLinked !== undefined )
    {
      await db
        .update( organizations )
        .set( { stripeConnectLinked: stripeData.stripeConnectLinked } )
        .where( eq( organizations.id, orgId ) );
    }

    if ( stripeData.stripeAccountCreated )
    {
      await db
        .update( organizations )
        .set( { stripeAccountCreated: stripeData.stripeAccountCreated } )
        .where( eq( organizations.id, orgId ) );
    }

    // Add more fields as necessary

    // Fetch the updated organization data (optional)
    const updatedOrg = await db
      .select()
      .from( organizations )
      .where( eq( organizations.id, orgId ) )
      .limit( 1 );

    return updatedOrg[ 0 ]; // Return the updated organization data
  } catch ( error )
  {
    console.error( 'Error updating organization:', error );
    throw new Error( 'Failed to update organization' );
  }
}

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