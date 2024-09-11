import Stripe from 'stripe';

import { eq } from 'drizzle-orm'; // Ensure eq is correctly imported
import { db } from '@/db';
import { organizations } from '@/db/schema';

const stripe = new Stripe( process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
} );

export async function fetchRefundDisputeSession ( orgId: string )
{
  try
  {
    // Fetch the Stripe account ID for the organization
    const org = await db
      .select()
      .from( organizations )
      .where( eq( organizations.id, orgId ) )
      .limit( 1 );

    const stripeAccountId = org[ 0 ]?.stripeAccountId;

    if ( !stripeAccountId )
    {
      throw new Error( 'Stripe account ID not found' );
    }

    // Create an account session with refund and dispute management enabled
    const accountSession = await stripe.accountSessions.create( {
      account: stripeAccountId,
      components: {
        refund_managment: {
          enabled: true,
        },
        dispute_management: {
          enabled: true,
        },
      },
    } );

    return {
      client_secret: accountSession.client_secret,
    };
  } catch ( error )
  {
    console.error( 'Error creating refund and dispute session: ', error );
    throw new Error( `Failed to create session: ${ error }` );
  }
}
