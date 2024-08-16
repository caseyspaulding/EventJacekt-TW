import { NextResponse } from 'next/server';
import { stripe } from '@/utils/stripe';

// Exporting a POST function for the App Router
export async function POST ( req: Request )
{
  try
  {
    const body = await req.json(); // Parsing the request body

    const accountSession = await stripe.accountSessions.create( {
      account: body.account,
      components: {
        account_onboarding: { enabled: true },
      },
    } );

    return NextResponse.json( {
      client_secret: accountSession.client_secret,
    } );
  } catch ( error: any )
  {
    console.error(
      "An error occurred when calling the Stripe API to create an account session",
      error
    );
    return NextResponse.json( { error: error.message }, { status: 500 } );
  }
}

// You can add other HTTP method handlers (e.g., GET, DELETE) if needed
