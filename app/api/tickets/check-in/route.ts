import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { orgEventTickets } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST ( req: NextRequest )
{
  const { ticketId } = await req.json();

  // Update the ticket status in the database
  const updatedTicket = await db
    .update( orgEventTickets )
    .set( { status: 'checked-in' } )
    .where( eq( orgEventTickets.id, ticketId ) )
    .returning( { id: orgEventTickets.id, status: orgEventTickets.status } )
    .execute();

  if ( !updatedTicket.length )
  {
    return NextResponse.json( { error: 'Ticket not found or failed to update' }, { status: 400 } );
  }

  return NextResponse.json( { message: 'Ticket checked in successfully', ticket: updatedTicket[ 0 ] } );
}
