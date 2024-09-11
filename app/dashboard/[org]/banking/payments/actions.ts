import { db } from '@/db';
import { organizations } from '@/db/schema';
import { stripe } from '@/utils/stripe';
import { eq } from 'drizzle-orm';

// Define the server action for fetching the payments client secret
export async function fetchPaymentsClientSecret ( orgId: string )
{
  try
  {
    // Fetch the Stripe account ID for the organization
    const org = await db
      .select()
      .from( organizations )
      .where( eq( organizations.id, orgId ) ) // Use eq function for comparison
      .limit( 1 );

    const stripeAccountId = org[ 0 ]?.stripeAccountId;

    if ( !stripeAccountId )
    {
      throw new Error( 'Stripe account ID not found' );
    }

    // Create an account session for Stripe Connect embedded components
    const accountSession = await stripe.accountSessions.create( {
      account: stripeAccountId,
      components: {
        payments: {
          enabled: true, // Enable the payments component
        },
      },
    } );

    return accountSession.client_secret;
  } catch ( error )
  {
    console.error( 'Error creating account session:', error );
    throw error;
  }
}
