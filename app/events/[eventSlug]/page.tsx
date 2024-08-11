import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/db';
import { events } from '@/db/schema';
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

  if ( !event )
  {
    notFound();
  }

  return (
    <div>
      <h1>{ eventData.name }</h1>
      <p>{ eventData.description }</p>
      <p>Start Date: { eventData.startDate.toLocaleDateString() ? new Date( eventData.startDate ).toLocaleDateString() : 'No start date available' }</p>
      <p>End Date: { eventData.endDate.toLocaleDateString() ? new Date( eventData.startDate ).toLocaleDateString() : 'No start date available' }</p>
      <p>Venue: { eventData.venue }</p>

     
    </div>
  );
}

