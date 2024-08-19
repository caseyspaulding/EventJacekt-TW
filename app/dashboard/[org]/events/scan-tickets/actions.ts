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
      purchaseDate: orgEventTickets.purchaseDate,
      checkInStatus: orgEventTickets.checkInStatus,
    } )
    .from( orgEventTickets )
    .innerJoin( events, eq( orgEventTickets.eventId, events.id ) )
    .where( eq( orgEventTickets.id, ticketId ) )
    .execute();

  if ( !ticket )
  {
    console.error( 'Ticket not found.' );
    return null;
  }
  
  console.log( 'Fetched ticket:', ticket ); // Log the fetched ticket 

  return {
    ...ticket,
    purchaseDate: ticket.purchaseDate ? ticket.purchaseDate.toISOString() : null,
  };
}

export async function checkInTicket ( ticketId: string )
{
  const result = await db
    .update( orgEventTickets )
    .set( { checkInStatus: true } )
    .where( eq( orgEventTickets.id, ticketId ) )
    .execute();

  if ( !result )
  {
    throw new Error( 'Failed to check in ticket' );
  }

  return { success: true };
}