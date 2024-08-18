'use server';

import { db } from '@/db';
import { orgEventTickets } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function checkInTicket ( formData: FormData )
{
  const ticketId = formData.get( 'ticketId' ) as string;

  // Update the ticket's check-in status in the database
  const updatedTicket = await db
    .update( orgEventTickets )
    .set( { checkInStatus: 'checked_in' } )
    .where( eq( orgEventTickets.id, ticketId ) )
    .returning( { id: orgEventTickets.id, checkInStatus: orgEventTickets.checkInStatus } )
    .execute();

  if ( !updatedTicket.length )
  {
    throw new Error( 'Ticket not found or failed to update' );
  }

  // Optionally, redirect or show a confirmation page after successful check-in
}
