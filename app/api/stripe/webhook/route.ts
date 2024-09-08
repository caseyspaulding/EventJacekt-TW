import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe( process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
} );

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST ( request: NextRequest )
{
  const sig = request.headers.get( 'stripe-signature' );

  if ( !sig )
  {
    console.error( 'No Stripe signature found' );
    return NextResponse.json( { error: 'No Stripe signature found' }, { status: 400 } );
  }

  let event: Stripe.Event;

  try
  {
    const text = await request.text();
    const rawBody = new TextEncoder().encode( text );

    console.log( 'Received signature:', sig );
    console.log( 'Raw body (first 100 chars):', text.substring( 0, 100 ) );
    console.log( 'Raw body length:', text.length );

    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch ( err: any )
  {
    console.error( '⚠️ Webhook signature verification failed.', err.message );
    return NextResponse.json( { error: `Webhook Error: ${ err.message }` }, { status: 400 } );
  }

  console.log( 'Event processed successfully:', event.type );

  // Handle the event
  switch ( event.type )
  {
    case 'payment_intent.succeeded':
      // eslint-disable-next-line no-case-declarations
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

  // Return a response to acknowledge receipt of the event
  return NextResponse.json( { received: true } );
}