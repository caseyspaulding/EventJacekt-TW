'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

import { getEventIdBySlug } from '../../../../../actions/getEventIdBySlug';
import toast from 'react-hot-toast';
import { createTicketType } from '@/app/actions/ticketActions';
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
        return <p className="text-center text-lg text-gray-700">Loading...</p>;
    }

    const handleSubmit = async ( e: { preventDefault: () => void } ) =>
    {
        e.preventDefault();
        if ( !user ) return;

        const orgId = user.organizationId;

        const formData = new FormData();
        formData.append( 'orgId', orgId );
        formData.append( 'eventId', eventId );
        formData.append( 'name', ticketName );
        formData.append( 'description', description );
        formData.append( 'price', price.toString() );
        formData.append( 'quantity', quantity.toString() );
        formData.append( 'saleStartDate', saleStartDate );
        formData.append( 'saleEndDate', saleEndDate );
        formData.append( 'eventDate', eventDate );
        formData.append( 'isEarlyBird', isEarlyBird.toString() );
        formData.append( 'maxPerCustomer', maxPerCustomer?.toString() ?? '' );

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
        <div className="container mx-auto  bg-white p-8 ">
            <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">Create Tickets for Event</h1>
            <p className="mb-8 text-center text-gray-600">
                Fill in the details below to create a new ticket type for your event. Define different ticket types like General Admission, VIP, or Early Bird, and set their respective prices, quantities, and sale dates.
            </p>

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
                    <label className="block text-sm font-medium text-gray-700">Event Date</label>
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
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Create Ticket
                </button>
            </form>

            { isModalOpen && (
                <ModalEventCreation onClose={ () => setIsModalOpen( false ) }>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Ticket Types Created Successfully!</h1>
                        <p className="text-gray-700 mb-4">
                            Your ticket types for the event have been created. You can now share the event page with your audience.
                        </p>
                        <Link
                            href={ `/events/${ eventSlug }` }
                            className="text-blue-600 hover:underline"
                        >
                            Go to Event Page
                        </Link>
                    </div>
                </ModalEventCreation>
            ) }
        </div>
    );
};

export default CreateTicketsPage;
