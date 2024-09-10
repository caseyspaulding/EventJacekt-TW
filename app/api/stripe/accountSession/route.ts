import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe( process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
} );

export async function POST ( req: Request )
{
  try
  {
    const { accountId } = await req.json();

    const accountSession = await stripe.accountSessions.create( {
      account: accountId, // Replace this with your connected account ID
      components: {
        payments: {
          enabled: true,
          features: {
            refund_management: true,
            dispute_management: true,
            capture_payments: true,
          },
        },
      },
    } );

    return NextResponse.json( {
      client_secret: accountSession.client_secret,
    } );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch ( error: any )
  {
    console.error(
      'An error occurred when calling the Stripe API to create an account session',
      error
    );
    return NextResponse.json( { error: error.message }, { status: 500 } );
  }
}
