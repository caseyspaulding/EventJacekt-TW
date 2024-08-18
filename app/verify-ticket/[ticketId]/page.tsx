import { db } from '@/db';
import { orgEventTickets, events } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { checkInTicket } from './action';

export default async function VerifyTicketPage ( { params }: { params: { ticketId: string } } )
{
  const { ticketId } = params;

  // Fetch the ticket from the database
  const [ ticket ] = await db
    .select( {
      id: orgEventTickets.id,
      name: orgEventTickets.name,
      status: orgEventTickets.status,
      eventName: events.name, // Assuming the event name is stored in the `events` table
      validFrom: orgEventTickets.validFrom,
      validUntil: orgEventTickets.validUntil,
      purchaseDate: orgEventTickets.purchaseDate,
      checkInStatus: orgEventTickets.checkInStatus,
    } )
    .from( orgEventTickets )
    .innerJoin( events, eq( orgEventTickets.eventId, events.id ) ) // Join with the events table
    .where( eq( orgEventTickets.id, ticketId ) )
    .execute();

  if ( !ticket )
  {
    return <p className="text-center text-red-600 font-semibold mt-8">Ticket not found or already used.</p>;
  }

  // Check if the ticket has already been used
  if ( ticket.checkInStatus === 'checked_in' )
  {
    return <p className="text-center text-red-600 font-semibold mt-8">This ticket has already been used.</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Verify Ticket</h1>
        <p className="text-lg text-gray-700 mb-2"><span className="font-semibold">Event:</span> { ticket.eventName }</p>
        <p className="text-lg text-gray-700 mb-2"><span className="font-semibold">Ticket Name:</span> { ticket.name }</p>
        <p className="text-lg text-gray-700 mb-2"><span className="font-semibold">Status:</span> { ticket.status }</p>
        <p className="text-lg text-gray-700 mb-6"><span className="font-semibold">Check-In Status:</span> { ticket.checkInStatus }</p>

        <form action={ checkInTicket } className="text-center">
          <input type="hidden" name="ticketId" value={ ticket.id } />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">
            Check-In
          </button>
        </form>
      </div>
    </div>
  );
}
