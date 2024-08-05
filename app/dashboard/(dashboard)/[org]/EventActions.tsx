"use client";

import React from "react";
import { createEvent, updateEvent, deleteEvent } from "./actions";
import { useFormStatus } from "react-dom";

interface EventActionsProps {
  events: { id: string; name: string }[];
}

const EventActions: React.FC<EventActionsProps> = ({ events }) => {
  const { pending } = useFormStatus();

  const handleUpdateEvent = (eventId: string) =>
    updateEvent.bind(null, eventId);
  const handleDeleteEvent = (eventId: string) =>
    deleteEvent.bind(null, eventId);

  return (
    <section className="mb-6 rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-2xl font-semibold">Events</h2>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            {event.name}
            <form action={handleUpdateEvent(event.id)} method="POST">
              <input type="text" name="name" defaultValue={event.name} />
              <button type="submit" disabled={pending}>
                Update
              </button>
            </form>
            <form action={handleDeleteEvent(event.id)} method="POST">
              <button type="submit" disabled={pending}>
                Delete
              </button>
            </form>
          </li>
        ))}
      </ul>
      <form action={createEvent} method="POST">
        <input type="text" name="name" placeholder="New Event" required />
        <button type="submit" disabled={pending}>
          Create Event
        </button>
      </form>
    </section>
  );
};

export default EventActions;
