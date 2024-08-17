import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/utils/stripe';
import { db } from '@/db';
import { orgEventTickets } from '@/db/schema';
import { getOrgIdFromTicketType, getStripeAccountIdFromOrgId } from '@/app/actions/ticketActions';
import { v4 as uuidv4 } from 'uuid';

export async function POST ( req: NextRequest )
{
  try
  {
    const body = await req.json();
    const { ticket, eventSlug, buyer } = body;

    console.log( 'Received ticket data:', ticket );
    console.log( 'Received buyer data:', buyer );

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
      customer_email: buyer.email, // Automatically send receipt to buyer's email
      mode: 'payment',
      success_url: `https://eventjacket.com/events/${ eventSlug }/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://eventjacket.com/events/${ eventSlug }/cancel`,
    } );

    // Step 4: Save the ticket purchase details directly to the database
    const ticketData = {
      eventId: ticket.eventId,
      orgId: orgId,
      customerId: buyer.customerId, // Ensure that `customerId` is available
      ticketTypeId: ticket.id,
      name: ticket.name,
      price: ticket.price,
      currency: 'USD', // Assuming you have a fixed currency or dynamically fetch it
      status: 'sold', // Directly setting the status if it’s pre-defined
      validFrom: ticket.validFrom,
      validUntil: ticket.validUntil,
      purchaseDate: new Date(),
      stripeSessionId: session.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      // Add any additional fields as required by your business logic
    };

    await db.insert( orgEventTickets ).values( ticketData );



    return NextResponse.json( session );
  } catch ( error )
  {
    console.error( 'Error creating Stripe Checkout session:', error );
    return NextResponse.json( { error: 'Failed to create session' }, { status: 500 } );
  }
}
