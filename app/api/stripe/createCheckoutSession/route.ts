import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/utils/stripe';
import { getOrgIdFromTicketType, getStripeAccountIdFromOrgId } from '@/app/actions/ticketActions';

export async function POST ( req: NextRequest )
{
  try
  {
    const body = await req.json();
    const { ticket, eventSlug } = body;

    console.log( 'Received ticket data:', ticket );

    // Step 1: Get the organization ID by ticket type
    const orgId = await getOrgIdFromTicketType( ticket.id );
    
    console.log( 'Fetched orgId:', orgId );

    if ( !orgId )
    {
      throw new Error( 'Organization ID not found.' );
    }

    // Step 2: Get the Stripe account ID by organization ID
    const orgStripeAccountId = await getStripeAccountIdFromOrgId( orgId );

    if ( !orgStripeAccountId )
    {
      // If the Stripe account ID is null, send an error response back to the UI
      return NextResponse.json(
        { error: 'Stripe account is not set up for this organization.' },
        { status: 400 }
      );
    }
    console.log( 'Fetched Stripe account ID:', orgStripeAccountId );

    if ( !orgStripeAccountId )
    {
      throw new Error( 'Connected Stripe account ID is missing.' );
    }

    const unitAmount = Math.round( ticket.price * 100 );

    // Step 3: Create the Stripe Checkout session
    const session = await stripe.checkout.sessions.create( {
      payment_method_types: [ 'card' ],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: ticket.name,
              description: `Ticket for ${ ticket.eventName }`,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: 50,
        transfer_data: {
          destination: orgStripeAccountId,
        },
      },
      mode: 'payment',
      success_url: `https://eventjacket.com/events/${ eventSlug }/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://eventjacket.com/events/${ eventSlug }/cancel`,
    } );

    return NextResponse.json( session );
  } catch ( error )
  {
    console.error( 'Error creating Stripe Checkout session:', error );
    return NextResponse.json( { error: 'Failed to create session' }, { status: 500 } );
  }
}
