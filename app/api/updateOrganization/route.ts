import { NextResponse } from 'next/server';
import { db } from '@/db'; // Your database connection
import { organizations } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST ( req: Request )
{
  try
  {
    const { orgId, stripeAccountId, stripeAccountType, stripeAccountStatus, stripeAccountCountry } = await req.json();

    // Update the organization with the Stripe account details
    const result = await db
      .update( organizations )
      .set( {
        stripeAccountId: stripeAccountId,
        stripeAccountType: stripeAccountType,
        stripeAccountStatus: stripeAccountStatus,
        stripeAccountCountry: stripeAccountCountry,
        stripeConnectLinked: true, // Set to true as the account is now linked
        stripeAccountCreated: new Date(), // Assuming the account was just created
      } )
      .where( eq( organizations.id, orgId ) )
      .returning();

    if ( result.length === 0 )
    {
      return NextResponse.json( { error: 'Organization not found' }, { status: 404 } );
    }

    return NextResponse.json( { success: true } );
  } catch ( error: any )
  {
    console.error( 'Error updating organization with Stripe account details:', error );
    return NextResponse.json( { error: error.message }, { status: 500 } );
  }
}
