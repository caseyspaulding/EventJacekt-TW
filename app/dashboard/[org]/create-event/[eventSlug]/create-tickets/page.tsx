// app/dashboard/[org]/create-event/create-tickets/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@/contexts/UserContext';
import { createClient } from '@/utils/supabase/client';
import { getEventIdBySlug } from '../../../../../actions/getEventIdBySlug';

const CreateTicketsPage = () =>
{
  const [ ticketName, setTicketName ] = useState( '' );
  const [ description, setDescription ] = useState( '' );
  const [ price, setPrice ] = useState( 0 );
  const [ quantity, setQuantity ] = useState( 0 );
  const [ saleStartDate, setSaleStartDate ] = useState( '' );
  const [ saleEndDate, setSaleEndDate ] = useState( '' );
  const [ isEarlyBird, setIsEarlyBird ] = useState( false );
  const [ maxPerCustomer, setMaxPerCustomer ] = useState( 1 );
  const [ eventId, setEventId ] = useState<string | null>( null );
  const router = useRouter();
  const { user } = useUser();
  const { eventSlug } = router.query;

  useEffect( () =>
  {
    async function fetchEventId ()
    {
      if ( eventSlug )
      {
        const id = await getEventIdBySlug( eventSlug as string );
        setEventId( id );
      }
    }

    fetchEventId();
  }, [ eventSlug ] );

  if ( !eventId )
  {
    return <p>Loading...</p>;
  }

  const handleSubmit = async ( e: { preventDefault: () => void; } ) =>
  {
    e.preventDefault();
    if ( !user ) return;
    const supabase = createClient();
    const eventId = "some-event-id"; // This should be dynamic based on the created event
    const orgId = user.organizationId; // Get the orgId from the context
    const orgName = user.orgName; // Get the orgName from the context

    const { data, error } = await supabase.from( 'ticket_types' ).insert( [
      {
        eventId,
        orgId,
        name: ticketName,
        description,
        price,
        quantity,
        saleStartDate,
        saleEndDate,
        isEarlyBird,
        maxPerCustomer,
      },
    ] );

    if ( error )
    {
      console.error( 'Error creating ticket:', error );
    } else
    {
      console.log( 'Ticket created successfully:', data );
      router.push( `/dashboard/${ encodeURIComponent( orgName ) }/manage-events` ); // Redirect to manage events or any other relevant page
    }
  };

  return (
    <div>
      <h1>Create Tickets for Event</h1>
      <p>Event ID: { eventId }</p>
      <form onSubmit={ handleSubmit }>
        <input type="text" value={ ticketName } onChange={ ( e ) => setTicketName( e.target.value ) } placeholder="Ticket Name" required />
        <textarea value={ description } onChange={ ( e ) => setDescription( e.target.value ) } placeholder="Description" required />
        <input type="number" value={ price } onChange={ ( e ) => setPrice( Number( e.target.value ) ) } placeholder="Price" required />
        <input type="number" value={ quantity } onChange={ ( e ) => setQuantity( Number( e.target.value ) ) } placeholder="Quantity" required />
        <input type="datetime-local" value={ saleStartDate } onChange={ ( e ) => setSaleStartDate( e.target.value ) } required />
        <input type="datetime-local" value={ saleEndDate } onChange={ ( e ) => setSaleEndDate( e.target.value ) } required />
        <label>
          <input type="checkbox" checked={ isEarlyBird } onChange={ ( e ) => setIsEarlyBird( e.target.checked ) } />
          Early Bird
        </label>
        <input type="number" value={ maxPerCustomer } onChange={ ( e ) => setMaxPerCustomer( Number( e.target.value ) ) } placeholder="Max Per Customer" />
        <button type="submit">Create Ticket</button>
      </form>
    </div>
  );
};

export default CreateTicketsPage;
