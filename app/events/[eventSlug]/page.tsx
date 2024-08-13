import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/db';
import { events, ticketTypes } from '@/db/schema'; // Import the ticketTypes table schema
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
    .from( ticketTypes )
    .where( eq( ticketTypes.eventId, eventId ) );

  return (
    <div>
      <h1>{ eventData.name }</h1>
      <p>{ eventData.description }</p>
      <p>Start Date: { eventData.startDate ? new Date( eventData.startDate ).toLocaleDateString() : 'No start date available' }</p>
      <p>End Date: { eventData.endDate ? new Date( eventData.endDate ).toLocaleDateString() : 'No end date available' }</p>
      <p>Venue: { eventData.venue }</p>

      <h2>Available Tickets</h2>
      { tickets.length > 0 ? (
        <ul>
          { tickets.map( ticket => (
            <li key={ ticket.id }>
              <h3>{ ticket.name }</h3>
              <p>{ ticket.description }</p>
              <p>Price: ${ parseFloat( ticket.price ).toFixed( 2 ) }</p>
              <p>Event Date: { ticket.eventDate ? new Date( ticket.eventDate ).toLocaleDateString() : 'No date available' }</p>
              <button>Buy Ticket</button> {/* Implement the purchase logic here */ }
            </li>
          ) ) }
        </ul>
      ) : (
        <p>No tickets available for this event.</p>
      ) }
    </div>
  );
}
