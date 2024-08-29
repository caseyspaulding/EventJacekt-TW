'use client';

import React from 'react';

interface EventDetailsProps
{
  date: string | React.ReactElement;
  time: string;
  timezone: string;
  locationName: string | null;
  locationAddress: string;
  refundPolicy: string;
  about: string | null;
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  eventDuration,
} ) =>
{
  return (
    <div className="max-w-6xl mt-4 mx-auto  bg-white ">
      {/* Date and Time */ }
      <section className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Date and time</h2>
        <div className="flex items-center text-gray-700">
          <span className="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" id="Notepad-Text--Streamline-Flex" height={ 14 } width={ 14 } ><desc>{ "Notepad Text Streamline Icon: https://streamlinehq.com" }</desc><g id="notepad-text--content-notes-book-notepad-notebook"><path id="Union" fill="#8fbffa" fillRule="evenodd" d="M7 1.985c-0.687 0 -2.122 0.048 -3.712 0.21A3.23 3.23 0 0 0 0.383 5.138 36.473 36.473 0 0 0 0.25 7.91c0 0.496 0.031 1.58 0.133 2.772a3.23 3.23 0 0 0 2.905 2.941c1.59 0.163 3.025 0.211 3.712 0.211 0.687 0 2.122 -0.048 3.712 -0.21a3.23 3.23 0 0 0 2.905 -2.942 36.45 36.45 0 0 0 0.133 -2.772c0 -0.496 -0.031 -1.581 -0.133 -2.774a3.23 3.23 0 0 0 -2.905 -2.941A40.168 40.168 0 0 0 7 1.985Z" clipRule="evenodd" strokeWidth={ 1 } /><path id="Union_2" fill="#2859c5" fillRule="evenodd" d="M2.809 3.454V0.915a0.75 0.75 0 0 1 1.5 0l0 2.54a0.75 0.75 0 1 1 -1.5 0Zm6.882 0 0 -2.539a0.75 0.75 0 0 1 1.5 0l0 2.54a0.75 0.75 0 0 1 -1.5 0ZM6.25 0.915l0 2.54a0.75 0.75 0 1 0 1.5 0l0 -2.54a0.75 0.75 0 0 0 -1.5 0Z" clipRule="evenodd" strokeWidth={ 1 } /><path id="Union_3" fill="#2859c5" fillRule="evenodd" d="M3.922 6.042a0.625 0.625 0 1 0 0 1.25h6.156a0.625 0.625 0 1 0 0 -1.25H3.922Zm0 2.97a0.625 0.625 0 1 0 0 1.25h2.951a0.625 0.625 0 1 0 0 -1.25H3.922Z" clipRule="evenodd" strokeWidth={ 1 } /></g></svg>
          </span>
          <div>
            <p>{ date }</p>
            <p>{ `${ time } ${ timezone }` }</p>
          </div>
        </div>
      </section>

      {/* Location */ }
      <section className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Location</h2>
        <div className="flex items-center text-gray-700">
          <span className="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" id="Location-Pin-3--Streamline-Flex" height="14" width="14"><desc>Location Pin 3 Streamline Icon: https://streamlinehq.com</desc><g id="location-pin-3--navigation-map-maps-pin-gps-location"><path id="Union" fill="#2859c5" d="M2.825 9.25a1.5 1.5 0 0 0 -1.335 0.816L0.35 12.294a1 1 0 0 0 0.89 1.456h11.52a1 1 0 0 0 0.887 -1.462l-1.163 -2.232a1.5 1.5 0 0 0 -1.33 -0.806H2.825Z" stroke-width="1"></path><path id="Union_2" fill="#8fbffa" fill-rule="evenodd" d="M6.945 0a4.791 4.791 0 0 0 -4.78 4.45c-0.085 1.193 0.183 2.432 0.934 3.419 0.894 1.174 1.805 1.98 3.228 2.928 0.407 0.27 0.938 0.27 1.346 0 1.423 -0.948 2.334 -1.754 3.227 -2.928 0.752 -0.987 1.02 -2.226 0.934 -3.42A4.791 4.791 0 0 0 7.055 0h-0.11Z" clip-rule="evenodd" stroke-width="1"></path><path id="Vector" fill="#2859c5" d="M7 6.094c0.96 0 1.5 -0.54 1.5 -1.5s-0.54 -1.5 -1.5 -1.5 -1.5 0.54 -1.5 1.5 0.54 1.5 1.5 1.5Z" stroke-width="1"></path></g></svg>
</span>
          <div>
            <p className="font-semibold">{ locationName }</p>
            <p>{ locationAddress }</p>
           
          </div>
        </div>
      </section>

      {/* Refund Policy */ }
      <section className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Refund Policy</h2>
        <p className="text-gray-700">{ refundPolicy }</p>
      </section>

      {/* About This Event */ }
      <section className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">About this event</h2>
        <div className="flex items-center text-gray-700">
          
        </div>
        <p className="mt-4 text-gray-700">{ about }</p>
      </section>
    </div>
  );
};

export default EventDetails;
