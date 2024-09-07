'use client';

import React from 'react';
import { formatDate, formatTime } from '@/utils/dateFormatter'; 
import VenueMap from '../VenueMap';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid';



interface FAQ
{
  question: string;
  answer: string;
}

interface EventDetailsProps
{
  eventId: string;
  name: string;
 
 
  description?: string | null;
  notes?: string | null;
  startDate: string;
  endDate: string;
  eventStartTime?: string | null;
  eventEndTime?: string | null;
  venue?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zipCode?: string | null;
  scheduleDetails?: string | null;
  bannerImage?: string | null;
  galleryImages?: string[] | null;
  videoLinks?: string[] | null;
  organizerContact?: string | null;
  maxAttendees?: number | null; 
  status: string;
  refundPolicy?: string | null;
  timezone: string  | null;
  tags?: string[] | null;
  highlights?: string[] | null;
  faqs?: string | FAQ[] | null | undefined; // Updated type to allow string or array
  ageRestriction?: string | null;
  parkingOptions?: string | null;
  createdAt: string   | null;
  updatedAt: string  | null;
}

const EventDetails: React.FC<EventDetailsProps> = ( {

  
  notes,
  startDate,
  endDate,
  eventStartTime,
  eventEndTime,
  venue,
  address,
  city,
  state,
 
  zipCode,
  //scheduleDetails,

  galleryImages,
  //videoLinks,
  organizerContact,

  refundPolicy,
  timezone,
  //tags,
  //highlights,
  faqs,
  ageRestriction,
  parkingOptions,

} ) =>
{
  // Ensure faqs is parsed correctly
  const parsedFaqs: FAQ[] =
    typeof faqs === 'string' ? JSON.parse( faqs ) : Array.isArray( faqs ) ? faqs : [];
  
  return (
    <div className="max-w-6xl mt-4 pb-16 mx-auto bg-white">
     

      {/* Date and Time */ }
      <section className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Date & Time</h2>
        <div className="flex items-center text-gray-700">
          <p>{ formatDate( startDate ) } to { formatDate( endDate ) }</p>
         
        </div>
        <div className='mt-2'>
          <p> { eventStartTime && eventEndTime && (
            <p> Doors Open : { formatTime( eventStartTime ) } { timezone }</p>
          ) }</p>
        </div>
      </section>

      {/* Location */ }
      <section className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Location</h2>

        {/* Only show venue if it exists */ }
        { venue && <p className="text-gray-700">{ venue }</p> }

        {/* Construct the address dynamically to avoid displaying "null" */ }
        { ( address || city || state || zipCode ) ? (
          <p className="text-gray-700">
            { address && `${ address }, ` }
            { city && `${ city }, ` }
            { state && `${ state }, ` }
            { zipCode && `${ zipCode }` }
          </p>
        ) : (
          <p className="text-gray-700">Location not specified</p>
        ) }

        {/* Show the map only if address exists */ }
        { address && (
          <VenueMap
            apiKey={ process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '' }
            address={ address }
          />
        ) }
      </section>

      {/* Refund Policy */ }
      <section className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Refund Policy</h2>
        <p className="text-gray-700">{ refundPolicy || 'No refund policy specified' }</p>
      </section>

      {/* Gallery Images */ }
      { galleryImages && galleryImages.length > 0 && (
        <section className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Gallery</h2>
          <div className="grid grid-cols-3 gap-4">
            { galleryImages.map( ( image, index ) => (
              <img key={ index } src={ image } alt={ `Gallery Image ${ index + 1 }` } className="w-full h-auto" />
            ) ) }
          </div>
        </section>
      ) }

      {/* About This Event */ }
      <section className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">About this Event</h2>
        { notes && <p className="text-gray-700">{ notes }</p> }
      </section>

      {/* Additional Event Information */ }
      <section className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Additional Information</h2>
        { ageRestriction && <p className="text-gray-700 my-3">Age Restriction: { ageRestriction }</p> }
        { parkingOptions && <p className="text-gray-700">Parking: { parkingOptions }</p> }
        { organizerContact && <p className="text-gray-700">Contact: { organizerContact }</p> }
      </section>

      {/* FAQs Section with Disclosure */ }
      <section className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">FAQs</h2>
        <div className="divide-y divide-gray-900/10">
          { parsedFaqs.map( ( faq, index ) => (
            <Disclosure key={ index } as="div" className="pt-6">
              <dt>
                <DisclosureButton className="group flex   items-start justify-between text-left text-gray-900">
                  <span className="text-base font-semibold leading-7">{ faq.question }</span>
                  <span className="ml-6 flex h-7 items-center">
                    <PlusIcon aria-hidden="true" className="h-6 w-6 group-data-[open]:hidden" />
                    <MinusIcon aria-hidden="true" className="h-6 w-6 [.group:not([data-open])_&]:hidden" />
                  </span>
                </DisclosureButton>
              </dt>
              <DisclosurePanel as="dd" className="mt-2 pr-12">
                <p className="text-base leading-7 text-gray-600">{ faq.answer }</p>
              </DisclosurePanel>
            </Disclosure>
          ) ) }
        </div>
      </section>
     
    </div>
  );
};

export default EventDetails;