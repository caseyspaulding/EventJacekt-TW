'use client';

import { useState } from 'react';
import { createClient } from '@utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { generateSlug } from '@/utils/stringUtils';

const CreateEventPage = () =>
{
  const [ name, setName ] = useState( '' );
  const [ description, setDescription ] = useState( '' );
  const [ startDate, setStartDate ] = useState( '' );
  const [ endDate, setEndDate ] = useState( '' );
  const [ venue, setVenue ] = useState( '' );
  const [ address, setAddress ] = useState( '' );
  const [ city, setCity ] = useState( '' );
  const [ state, setState ] = useState( '' );
  const [ country, setCountry ] = useState( '' );
  const [ zipCode, setZipCode ] = useState( '' );
  const [ maxAttendees, setMaxAttendees ] = useState( 0 );
  const slug = generateSlug( name );
  const router = useRouter();
  const { user } = useUser();

  const handleSubmit = async ( e: { preventDefault: () => void } ) =>
  {
    e.preventDefault();
    if ( !user ) return;
    const supabase = createClient();
    const orgId = user.organizationId; // Get the orgId from the context

    const { data, error } = await supabase.from( 'events' ).insert( [
      {
        orgId,
        name,
        slug,
        description,
        startDate,
        endDate,
        venue,
        address,
        city,
        state,
        country,
        zipCode,
        maxAttendees,
        status: 'draft', // default status
      },
    ] );

    if ( error )
    {
      console.error( 'Error creating event:', error );
    } else
    {
      console.log( 'Event created successfully:', data );
      router.push( `/dashboard/[org]/create-event/create-tickets` );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Create an Event</h1>
      <form onSubmit={ handleSubmit } className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Event Name
          </label>
          <input
            type="text"
            id="name"
            value={ name }
            onChange={ ( e ) => setName( e.target.value ) }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Event Name"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={ description }
            onChange={ ( e ) => setDescription( e.target.value ) }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Description"
            required
          />
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="datetime-local"
            id="startDate"
            value={ startDate }
            onChange={ ( e ) => setStartDate( e.target.value ) }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="datetime-local"
            id="endDate"
            value={ endDate }
            onChange={ ( e ) => setEndDate( e.target.value ) }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="venue" className="block text-sm font-medium text-gray-700">
            Venue
          </label>
          <input
            type="text"
            id="venue"
            value={ venue }
            onChange={ ( e ) => setVenue( e.target.value ) }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Venue"
            required
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            id="address"
            value={ address }
            onChange={ ( e ) => setAddress( e.target.value ) }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Address"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              id="city"
              value={ city }
              onChange={ ( e ) => setCity( e.target.value ) }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="City"
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">
              State
            </label>
            <input
              type="text"
              id="state"
              value={ state }
              onChange={ ( e ) => setState( e.target.value ) }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="State"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <input
              type="text"
              id="country"
              value={ country }
              onChange={ ( e ) => setCountry( e.target.value ) }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Country"
            />
          </div>

          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
              Zip Code
            </label>
            <input
              type="text"
              id="zipCode"
              value={ zipCode }
              onChange={ ( e ) => setZipCode( e.target.value ) }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Zip Code"
            />
          </div>
        </div>

        <div>
          <label htmlFor="maxAttendees" className="block text-sm font-medium text-gray-700">
            Max Attendees
          </label>
          <input
            type="number"
            id="maxAttendees"
            value={ maxAttendees }
            onChange={ ( e ) => setMaxAttendees( Number( e.target.value ) ) }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Max Attendees"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEventPage;
