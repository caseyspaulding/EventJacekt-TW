'use server';

import { db } from '@/db';
import { orgEventTickets, events } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function fetchTicketInfo ( ticketId: string )
{
  const [ ticket ] = await db
    .select( {
      id: orgEventTickets.id,
      name: orgEventTickets.name,
      status: orgEventTickets.status,
      eventName: events.name,
      validFrom: orgEventTickets.validFrom,
      validUntil: orgEventTickets.validUntil,
      purchaseDate: orgEventTickets.purchaseDate,
      checkInStatus: orgEventTickets.checkInStatus ,
    } )
    .from( orgEventTickets )
    .innerJoin( events, eq( orgEventTickets.eventId, events.id ) )
    .where( eq( orgEventTickets.id, ticketId ) )
    .execute();

  if ( !ticket )
  {
    return null;
  }

  return {
    ...ticket,
    validFrom: ticket.validFrom ? ticket.validFrom.toString() : null,
    validUntil: ticket.validUntil ? ticket.validUntil.toString() : null,
    purchaseDate: ticket.purchaseDate ? ticket.purchaseDate.toISOString() : null,
  };
}

export async function checkInTicket ( formData: FormData )
{
  const ticketId = formData.get( 'ticketId' ) as string;

  if ( !ticketId )
  {
    throw new Error( 'Ticket ID is required.' );
  }

  try
  {
    // Update the ticket's checkInStatus to 'checked_in'
    const result = await db
      .update( orgEventTickets )
      .set( { checkInStatus: 'checked_in' } )
      .where( eq( orgEventTickets.id, ticketId ) )
      .returning( { id: orgEventTickets.id, checkInStatus: orgEventTickets.checkInStatus } )
      .execute();

    if ( result.length === 0 )
    {
      throw new Error( 'Ticket not found or could not be checked in.' );
    }

    return { success: true, ticketId: result[ 0 ].id };
  } catch ( error )
  {
    console.error( 'Error checking in ticket:', error );
    throw new Error( 'Failed to check in the ticket.' );
  }
}