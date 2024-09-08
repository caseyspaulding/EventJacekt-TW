import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe( process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
} );

// Helper function to get the raw body from the Request object
async function getRawBody ( request: Request )
{
  const readable = request.body;
  const reader = readable?.getReader();
  let result = new Uint8Array( 0 );

  if ( reader )
  {
    let done = false;
    while ( !done )
    {
      const { done: doneReading, value } = await reader.read();
      done = doneReading;
      if ( value )
      {
        const newResult = new Uint8Array( result.length + value.length );
        newResult.set( result );
        newResult.set( value, result.length );
        result = newResult;
      }
    }
  }

  return result;
}

// POST handler for Stripe Webhook
export async function POST ( request: Request )
{
  const sig = request.headers.get( 'stripe-signature' ) || '';

  // Get raw body
  const rawBody = await getRawBody( request );

  // Convert Uint8Array to Buffer
  const buf = Buffer.from( rawBody );

  let event: Stripe.Event;

  try
  {
    // Verify the webhook signature and construct the event
    event = stripe.webhooks.constructEvent( buf, sig, process.env.STRIPE_WEBHOOK_SECRET! );
  } catch ( err )
  {
    console.error( 'Webhook signature verification failed:', err );
    return NextResponse.json( { error: 'Webhook signature verification failed.' }, { status: 400 } );
  }

  // Handle the event based on type
  switch ( event.type )
  {
    case 'checkout.session.completed':
      // eslint-disable-next-line no-case-declarations
      const session = event.data.object as Stripe.Checkout.Session;
      console.log( `Payment for session ${ session.id } was successful!` );
      break;
    default:
      console.log( `Unhandled event type ${ event.type }` );
  }

  return NextResponse.json( { received: true } );
}
