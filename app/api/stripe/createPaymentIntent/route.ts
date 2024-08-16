// app/api/stripe/create-payment-intent/route.ts

import { NextResponse } from 'next/server';
import { stripe } from '@/utils/stripe';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { organizations, orgEventTickets } from '@/db/schema';

export async function POST ( req: Request )
{
  const { ticketId, orgId } = await req.json();

  try
  {
    const ticket = await db
      .select( {
        id: orgEventTickets.id,
        price: orgEventTickets.price,
      } )
      .from( orgEventTickets )
      .where( eq( orgEventTickets.id, ticketId ) )
      .limit( 1 );

    const org = await db
      .select( {
        id: organizations.id,
        stripeAccountId: organizations.stripeAccountId,
      } )
      .from( organizations )
      .where( eq( organizations.id, orgId ) )
      .limit( 1 );

    if ( ticket.length === 0 || org.length === 0 || !org[ 0 ].stripeAccountId )
    {
      return NextResponse.json( { error: 'Invalid ticket or organization' }, { status: 400 } );
    }

    // Convert the price to a number in the smallest currency unit (cents for USD)
    const ticketPriceInCents = parseInt( ticket[ 0 ].price, 10 );

    const applicationFeeAmount = 75; // 75 cents ($0.75) fixed fee

    const paymentIntent = await stripe.paymentIntents.create( {
      amount: ticketPriceInCents, // Ensure this is a number
      currency: 'usd',
      application_fee_amount: applicationFeeAmount,
      transfer_data: {
        destination: org[ 0 ].stripeAccountId,
      },
    } );

    return NextResponse.json( { clientSecret: paymentIntent.client_secret } );
  } catch ( error: any )
  {
    console.error( 'Error creating payment intent:', error );
    return NextResponse.json( { error: error.message }, { status: 500 } );
  }
}