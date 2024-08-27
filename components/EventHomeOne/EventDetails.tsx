'use client';

import React from 'react';

interface EventDetailsProps
{
  date: string;
  time: string;
  timezone: string;
  locationName: string;
  locationAddress: string;
  refundPolicy: string;
  about: string;
  eventDuration: string;
}

const EventDetails: React.FC<EventDetailsProps> = ( {
  date,
  time,
  timezone,
  locationName,
  locationAddress,
  refundPolicy,
  about,
  eventDuration,
} ) =>
{
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Date and Time */ }
      <section className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Date and time</h2>
        <div className="flex items-center text-gray-700">
          <span className="mr-2">📅</span>
          <div>
            <p>{ date }</p>
            <p>{ `${ time } ${ timezone }` }</p>
          </div>
        </div>
      </section>

      {/* Location */ }
      <section className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Location</h2>
        <div className="flex items-center text-gray-700">
          <span className="mr-2">📍</span>
          <div>
            <p className="font-semibold">{ locationName }</p>
            <p>{ locationAddress }</p>
            <button className="mt-1 text-blue-500 hover:underline">
              Show map
            </button>
          </div>
        </div>
      </section>

      {/* Refund Policy */ }
      <section className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Refund Policy</h2>
        <p className="text-gray-700">{ refundPolicy }</p>
      </section>

      {/* About This Event */ }
      <section className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">About this event</h2>
        <div className="flex items-center text-gray-700">
          <span className="mr-2">🕒</span>
          <p>{ `Event lasts ${ eventDuration }` }</p>
        </div>
        <p className="mt-4 text-gray-700">{ about }</p>
      </section>
    </div>
  );
};

export default EventDetails;
