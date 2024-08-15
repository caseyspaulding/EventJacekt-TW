import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/db';
import { events, orgTicketTypes } from '@/db/schema'; // Import the ticketTypes table schema
import { getEventIdBySlug } from '@/app/actions/getEventIdBySlug';
import { eq } from 'drizzle-orm/expressions';

interface Params
{
  eventSlug: string;
}

export default async function EventPage ( { params }: { params: Params } )
{
  const eventSlug = params.eventSlug;

  // Fetch the event ID by slug
  const eventId = await getEventIdBySlug( eventSlug );

  if ( !eventId )
  {
    notFound();
  }

  // Fetch the event details using the event ID
  const event = await db
    .select()
    .from( events )
    .where( eq( events.id, eventId ) )
    .limit( 1 );

  const eventData = event[ 0 ];

  if ( !eventData )
  {
    notFound();
  }

  // Fetch the ticket types associated with the event
  const tickets = await db
    .select()
    .from( orgTicketTypes )
    .where( eq( orgTicketTypes.eventId, eventId ) );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{ eventData.name }</h1>
      <p className="text-lg text-gray-700 mb-2">{ eventData.description }</p>
      <p className="text-sm text-gray-500 mb-2">
        Start Date: { eventData.startDate ? new Date( eventData.startDate ).toLocaleDateString() : 'No start date available' }
      </p>
      <p className="text-sm text-gray-500 mb-2">
        End Date: { eventData.endDate ? new Date( eventData.endDate ).toLocaleDateString() : 'No end date available' }
      </p>
      <p className="text-sm text-gray-500 mb-6">Venue: { eventData.venue }</p>

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Available Tickets</h2>
      { tickets.length > 0 ? (
        <ul className="space-y-4">
          { tickets.map( ticket => (
            <li key={ ticket.id } className="p-4 bg-gray-50 border border-gray-200 rounded-md">
              <h3 className="text-xl font-medium text-gray-900">{ ticket.name }</h3>
              <p className="text-gray-700">{ ticket.description }</p>
              <p className="text-lg text-gray-800 font-semibold">Price: ${ parseFloat( ticket.price ).toFixed( 2 ) }</p>
              <p className="text-sm text-gray-500">
                Event Date: { ticket.eventDate ? new Date( ticket.eventDate ).toLocaleDateString() : 'No date available' }
              </p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
                Buy Ticket
              </button>
            </li>
          ) ) }
        </ul>
      ) : (
        <p className="text-red-500">No tickets available for this event.</p>
      ) }
    </div>
  );
}
