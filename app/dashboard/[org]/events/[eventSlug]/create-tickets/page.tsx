'use client';

import { use, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  const { eventSlug } = useParams();

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

  const handleSubmit = async ( e: { preventDefault: () => void } ) =>
  {
    e.preventDefault();
    if ( !user ) return;
    const supabase = createClient();
    const orgId = user.organizationId;

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
      router.push( `/dashboard/${ encodeURIComponent( user.orgName ) }/manage-events` );
    }
  };

  return (
    <div>
      <h1>Create Tickets for Event</h1>
      <p>Event ID: { eventId }</p>
      <form onSubmit={ handleSubmit }>
        <div>
          <label>Ticket Name</label>
          <input
            type="text"
            value={ ticketName }
            onChange={ ( e ) => setTicketName( e.target.value ) }
            placeholder="Ticket Name"
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={ description }
            onChange={ ( e ) => setDescription( e.target.value ) }
            placeholder="Description"
            required
          />
        </div>
        <div>
          <label>Price</label>
          <input
            type="number"
            value={ price }
            onChange={ ( e ) => setPrice( Number( e.target.value ) ) }
            placeholder="Price"
            required
          />
        </div>
        <div>
          <label>Quantity</label>
          <input
            type="number"
            value={ quantity }
            onChange={ ( e ) => setQuantity( Number( e.target.value ) ) }
            placeholder="Quantity"
            required
          />
        </div>
        <div>
          <label>Sale Start Date</label>
          <input
            type="datetime-local"
            value={ saleStartDate }
            onChange={ ( e ) => setSaleStartDate( e.target.value ) }
            required
          />
        </div>
        <div>
          <label>Sale End Date</label>
          <input
            type="datetime-local"
            value={ saleEndDate }
            onChange={ ( e ) => setSaleEndDate( e.target.value ) }
            required
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={ isEarlyBird }
              onChange={ ( e ) => setIsEarlyBird( e.target.checked ) }
            />
            Early Bird
          </label>
        </div>
        <div>
          <label>Max Per Customer</label>
          <input
            type="number"
            value={ maxPerCustomer }
            onChange={ ( e ) => setMaxPerCustomer( Number( e.target.value ) ) }
            placeholder="Max Per Customer"
          />
        </div>
        <button type="submit">Create Ticket</button>
      </form>
    </div>
  );
};

export default CreateTicketsPage;
