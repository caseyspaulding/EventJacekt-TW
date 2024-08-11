
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


  const handleSubmit = async ( e: { preventDefault: () => void; } ) =>
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
    <div>
      <h1>Create an Event</h1>
      <form onSubmit={ handleSubmit }>
        <input type="text" value={ name } onChange={ ( e ) => setName( e.target.value )   } placeholder="Event Name" required />
        <textarea value={ description } onChange={ ( e ) => setDescription( e.target.value ) } placeholder="Description" required />
        <input type="datetime-local" value={ startDate } onChange={ ( e ) => setStartDate( e.target.value ) } required />
        <input type="datetime-local" value={ endDate } onChange={ ( e ) => setEndDate( e.target.value ) } required />
        <input type="text" value={ venue } onChange={ ( e ) => setVenue( e.target.value ) } placeholder="Venue" required />
        <input type="text" value={ address } onChange={ ( e ) => setAddress( e.target.value ) } placeholder="Address" />
        <input type="text" value={ city } onChange={ ( e ) => setCity( e.target.value ) } placeholder="City" />
        <input type="text" value={ state } onChange={ ( e ) => setState( e.target.value ) } placeholder="State" />
        <input type="text" value={ country } onChange={ ( e ) => setCountry( e.target.value ) } placeholder="Country" />
        <input type="text" value={ zipCode } onChange={ ( e ) => setZipCode( e.target.value ) } placeholder="Zip Code" />
        <input type="number" value={ maxAttendees } onChange={ ( e ) => setMaxAttendees( Number( e.target.value ) ) } placeholder="Max Attendees" />
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEventPage;
