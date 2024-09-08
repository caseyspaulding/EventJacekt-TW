import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe( process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
} );

// New configuration method
export const runtime = 'edge'; // This enables Edge runtime
export const dynamic = 'force-dynamic'; // This ensures the route is not statically optimized

async function getRawBody ( req: NextRequest ): Promise<Buffer>
{
  const chunks = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for await ( const chunk of req.body as any )
  {
    chunks.push( typeof chunk === 'string' ? Buffer.from( chunk ) : chunk );
  }
  return Buffer.concat( chunks );
}

export async function POST ( req: NextRequest )
{
  const sig = req.headers.get( 'stripe-signature' );

  if ( !sig )
  {
    console.error( 'No Stripe signature found' );
    return NextResponse.json( { error: 'No Stripe signature found' }, { status: 400 } );
  }

  let event: Stripe.Event;

  try
  {
    const rawBody = await getRawBody( req );
    console.log( 'Raw body (first 100 chars):', rawBody.toString().substring( 0, 100 ) );
    console.log( 'Raw body length:', rawBody.length );
    console.log( 'Received signature:', sig );

    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch ( err: any )
  {
    console.error( `Webhook Error: ${ err.message }` );
    return NextResponse.json( { error: `Webhook Error: ${ err.message }` }, { status: 400 } );
  }

  console.log( 'Event processed successfully:', event.type );

  // Handle the event
  switch ( event.type )
  {
    case 'checkout.session.completed':
      // eslint-disable-next-line no-case-declarations
      const session = event.data.object as Stripe.Checkout.Session;
      console.log( `Payment for session ${ session.id } was successful!` );
      // Add your business logic here
      break;
    // Add more cases for other event types you want to handle
    default:
      console.log( `Unhandled event type ${ event.type }` );
  }

  return NextResponse.json( { received: true } );
}