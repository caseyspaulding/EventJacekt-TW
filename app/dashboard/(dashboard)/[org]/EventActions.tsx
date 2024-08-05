'use client';

import React from 'react';
import { createEvent, updateEvent, deleteEvent } from './actions';
import { useFormStatus } from 'react-dom';

interface EventActionsProps
{
  events: { id: string; name: string }[];
}

const EventActions: React.FC<EventActionsProps> = ( { events } ) =>
{
  const { pending } = useFormStatus();

  const handleUpdateEvent = ( eventId: string ) => updateEvent.bind( null, eventId );
  const handleDeleteEvent = ( eventId: string ) => deleteEvent.bind( null, eventId );

  return (
    <section className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4">Events</h2>
      <ul>
        { events.map( event => (
          <li key={ event.id }>
            { event.name }
            <form action={ handleUpdateEvent( event.id ) } method="POST">
              <input type="text" name="name" defaultValue={ event.name } />
              <button type="submit" disabled={ pending }>Update</button>
            </form>
            <form action={ handleDeleteEvent( event.id ) } method="POST">
              <button type="submit" disabled={ pending }>Delete</button>
            </form>
          </li>
        ) ) }
      </ul>
      <form action={ createEvent } method="POST">
        <input type="text" name="name" placeholder="New Event" required />
        <button type="submit" disabled={ pending }>Create Event</button>
      </form>
    </section>
  );
};

export default EventActions;
