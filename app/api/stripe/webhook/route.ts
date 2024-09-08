/* eslint-disable no-case-declarations */
import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';


const stripe = new Stripe( process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
} );

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// New configuration method
export const dynamic = 'force-dynamic';

export async function POST ( request: NextRequest )
{
  const sig = request.headers.get( 'stripe-signature' );

  if ( !sig )
  {
    console.error( 'No Stripe signature found' );
    return NextResponse.json( { error: 'No Stripe signature found' }, { status: 400 } );
  }

  try
  {
    const text = await request.text();

    console.log( 'Received signature:', sig );
    console.log( 'Raw body (first 100 chars):', text.substring( 0, 100 ) );
    console.log( 'Raw body length:', text.length );
    console.log( 'Webhook Secret (first 10 chars):', endpointSecret.substring( 0, 10 ) );

    const event = stripe.webhooks.constructEvent( text, sig, endpointSecret );

    console.log( 'Event processed successfully:', event.type );

    // Handle the event
    switch ( event.type )
    {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log( `PaymentIntent for ${ paymentIntent.amount } was successful!` );
        // Add your business logic here
        break;
      case 'checkout.session.completed':
        // eslint-disable-next-line no-case-declarations
        const session = event.data.object as Stripe.Checkout.Session;
        console.log( `Checkout session ${ session.id } was completed!` );
        // Add your business logic here
        break;
      default:
        console.log( `Unhandled event type ${ event.type }` );
    }

    return NextResponse.json( { received: true } );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch ( err: any )
  {
    console.error( '⚠️ Webhook Error:', err.message );
    return NextResponse.json( { error: `Webhook Error: ${ err.message }` }, { status: 400 } );
  }
}