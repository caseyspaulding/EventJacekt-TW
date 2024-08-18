import { db } from '@/db';
import { orgEventTickets, events } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function VerifyTicketPage ( { params }: { params: { ticketId: string } } )
{
  const { ticketId } = params;

  // Fetch the ticket from the database with a join to get the event name
  const [ ticket ] = await db
    .select( {
      id: orgEventTickets.id,
      name: orgEventTickets.name,
      status: orgEventTickets.status,
      eventName: events.name, // Assuming the event name is stored in the `events` table
      validFrom: orgEventTickets.validFrom,
      validUntil: orgEventTickets.validUntil,
      purchaseDate: orgEventTickets.purchaseDate,
      checkInStatus: orgEventTickets.checkInStatus
    } )
    .from( orgEventTickets )
    .innerJoin( events, eq( orgEventTickets.eventId, events.id ) ) // Join with the events table
    .where( eq( orgEventTickets.id, ticketId ) )
    .execute();

  if ( !ticket )
  {
    return <p>Ticket not found or already used.</p>;
  }

  // Check if the ticket has already been used
  if ( ticket.checkInStatus === 'checked_in' )
  {
    return <p>This ticket has already been used.</p>;
  }

  // Render the ticket information
  return (
    <div>
      <h1>Verify Ticket</h1>
      <p>Event: { ticket.eventName }</p>
      <p>Ticket Name: { ticket.name }</p>
      <p>Status: { ticket.status }</p>
      <p>Check-In Status: { ticket.checkInStatus }</p>
      <button onClick={ () => handleCheckIn( ticketId ) }>Check-In</button>
    </div>
  );
}

// Handle the check-in process
async function handleCheckIn ( ticketId: string )
{
  try
  {
    const response = await fetch( '/api/tickets/check-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify( { ticketId } ),
    } );

    if ( response.ok )
    {
      alert( 'Ticket checked in successfully!' );
      // Optionally redirect or update the page to reflect the check-in
    } else
    {
      alert( 'Failed to check in the ticket.' );
    }
  } catch ( error )
  {
    console.error( 'Error checking in the ticket:', error );
    alert( 'An error occurred during check-in.' );
  }
}
