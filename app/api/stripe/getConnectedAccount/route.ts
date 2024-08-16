// app/api/stripe/get-connected-account/route.ts

import { NextResponse } from 'next/server';
import { db } from '@/db'; // Your database connection
import { eq } from 'drizzle-orm'; 
import { organizations } from '@/db/schema';
import * as schema from '@/db/schema';

export async function GET ( req: Request )
{
  const { searchParams } = new URL( req.url );
  const orgId = searchParams.get( 'orgId' );

  if ( !orgId )
  {
    return NextResponse.json( { error: 'Organization ID is required' }, { status: 400 } );
  }

  try
  {
    const org = await db
      .select( {
        stripeAccountId: organizations.stripeAccountId,
      } )
      .from( organizations )
      .where( eq( organizations.id, orgId ) )
      .limit( 1 );

    if ( org.length > 0 && org[ 0 ].stripeAccountId )
    {
      return NextResponse.json( { accountId: org[ 0 ].stripeAccountId } );
    } else
    {
      return NextResponse.json( { accountId: null } );
    }
  } catch ( error: any )
  {
    console.error( 'Error fetching Stripe account ID:', error );
    return NextResponse.json( { error: error.message }, { status: 500 } );
  }
}