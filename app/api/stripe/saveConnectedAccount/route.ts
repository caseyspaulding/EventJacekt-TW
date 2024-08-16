// app/api/saveConnectedAccount/route.ts

import { NextResponse } from 'next/server';
import { db } from '@/db'; // Your database connection
import { organizations } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST ( req: Request )
{
  const { accountId, orgId } = await req.json();

  try
  {
    const result = await db
      .update( organizations )
      .set( { stripeConnectAccountId: accountId } )
      .where( eq( organizations.id, orgId ) )
      .returning();

    if ( result.length === 0 )
    {
      return NextResponse.json( { error: 'Organization not found' }, { status: 404 } );
    }

    return NextResponse.json( { success: true } );
  } catch ( error )
  {
    console.error( 'Failed to save connected account ID:', error );
    return NextResponse.json( { error: error}, { status: 500 } );
  }
}
