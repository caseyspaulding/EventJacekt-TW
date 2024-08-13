'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

import { getEventIdBySlug } from '../../../../../actions/getEventIdBySlug';
import toast from 'react-hot-toast';
import { createTicketType } from '@/app/actions/ticketActions';
import ModalBasic from '@/components/modals/ModalBasic';
import { Link } from 'tabler-icons-react';
import ModalEventCreation from '@/components/modals/ModalEventCreation';

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
  const [ eventDate, setEventDate ] = useState( '' );
  const [ isModalOpen, setIsModalOpen ] = useState( false );
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
    return <p className="text-center text-lg">Loading...</p>;
  }

  const handleSubmit = async ( e: { preventDefault: () => void } ) =>
  {
    e.preventDefault();
    if ( !user ) return;

    const orgId = user.organizationId;

    const formData = new FormData();
    formData.append( 'orgId', orgId );
    formData.append( 'eventId', eventId ); // Ensure you have eventId from the context or props
    formData.append( 'name', ticketName );
    formData.append( 'description', description );
    formData.append( 'price', price.toString() ); // Convert number to string
    formData.append( 'quantity', quantity.toString() ); // Convert number to string
    formData.append( 'saleStartDate', saleStartDate );
    formData.append( 'saleEndDate', saleEndDate );
    formData.append( 'eventDate', eventDate );
    formData.append( 'isEarlyBird', isEarlyBird.toString() ); // Convert boolean to string
    formData.append( 'maxPerCustomer', maxPerCustomer?.toString() ?? '' ); // Handle nullable field

    try
    {
      const response = await createTicketType( formData );

      if ( response.success )
      {
        toast.success( 'Ticket type created successfully!' );
        // Clear form
        setTicketName( '' );
        setDescription( '' );
        setPrice( 0 );
        setQuantity( 0 );
        setSaleStartDate( '' );
        setSaleEndDate( '' );
        setEventDate( '' );
        setIsEarlyBird( false );
        setMaxPerCustomer( 1 );
        setIsModalOpen( true );
      } else
      {
        toast.error( 'Failed to create ticket type: ' + response.message );
      }
    } catch ( error )
    {
      console.error( 'Error creating ticket type:', error );
      toast.error( 'An unexpected error occurred.' );
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Create Tickets for Event</h1>
      <p className="text-center text-gray-600">
        Fill in the details below to create a new ticket type for your event.  This defines the different types of tickets available for an event, such as general admission, VIP, or early bird. <p>It stores the attributes related to each type, like price, quantity, and sale dates. This table allows you to manage and configure ticket types independently of the actual tickets sold.</p> You can create multiple ticket types for an event, each with its own set of attributes.</p>

      <form onSubmit={ handleSubmit } className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Ticket Name</label>
          <input
            type="text"
            value={ ticketName }
            onChange={ ( e ) => setTicketName( e.target.value ) }
            placeholder="Ticket Name"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={ description }
            onChange={ ( e ) => setDescription( e.target.value ) }
            placeholder="Description"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            value={ price }
            onChange={ ( e ) => setPrice( Number( e.target.value ) ) }
            placeholder="Price"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            value={ quantity }
            onChange={ ( e ) => setQuantity( Number( e.target.value ) ) }
            placeholder="Quantity"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Sale Start Date</label>
          <input
            type="date"
            value={ saleStartDate }
            onChange={ ( e ) => setSaleStartDate( e.target.value ) }
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Sale End Date</label>
          <input
            type="date"
            value={ saleEndDate }
            onChange={ ( e ) => setSaleEndDate( e.target.value ) }
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ticket Event Date</label>
          <input
            type="date"
            value={ eventDate }
            onChange={ ( e ) => setEventDate( e.target.value ) }
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={ isEarlyBird }
            onChange={ ( e ) => setIsEarlyBird( e.target.checked ) }
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm font-medium text-gray-700">Early Bird</label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Max Per Customer</label>
          <input
            type="number"
            value={ maxPerCustomer }
            onChange={ ( e ) => setMaxPerCustomer( Number( e.target.value ) ) }
            placeholder="Max Per Customer"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create Ticket
        </button>
      </form>
      { isModalOpen && (
        <ModalEventCreation onClose={ () => setIsModalOpen( false ) }  >
          <div>
            <h1>Ticket Types Created Successfully!</h1>
            <p>Your ticket types for the event have been created. You can now share the event page with your audience.</p>
            <Link href={ `/events/${ eventSlug }` }>
              <a>Go to Event Page</a>
            </Link>
          </div>
        </ModalEventCreation>
      ) }
    </div>
  );
};

export default CreateTicketsPage;
