// /app/api/stripe/disputes/route.ts

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { eq } from 'drizzle-orm'; 
import { organizations } from '@/db/schema'; // Your schema from Drizzle ORM
import { db } from '@/db';

const stripe = new Stripe( process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
} );

export async function POST ( req: Request )
{
  try
  {
    const { orgId } = await req.json(); // Extract orgId from the request body

    // Fetch the Stripe account ID from your database using orgId
    const [ org ] = await db
      .select( { stripeAccountId: organizations.stripeAccountId } )
      .from( organizations )
      .where( eq( organizations.id, orgId ) )
      .limit( 1 ); // Return an array, so destructure the first result

    if ( !org || !org.stripeAccountId )
    {
      return NextResponse.json(
        { error: 'Organization not found or Stripe account not linked' },
        { status: 404 }
      );
    }

    // Fetch disputes from Stripe
    const disputes = await stripe.disputes.list(
      {
        limit: 10, // Adjust limit if needed
      },
      {
        stripeAccount: org.stripeAccountId, // Use the connected Stripe account
      }
    );

    return NextResponse.json( disputes.data ); // Return the disputes data
  } catch ( error )
  {
    console.error( 'Error fetching disputes:', error );
    return NextResponse.json( { error: 'Failed to fetch disputes' }, { status: 500 } );
  }
}