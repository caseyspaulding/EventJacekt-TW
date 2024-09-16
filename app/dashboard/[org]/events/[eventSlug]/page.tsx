'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getEventIdBySlug } from '../../../../actions/getEventIdBySlug';
import { useUser } from '@/contexts/UserContext';
import LogoSpinner from '@/components/Loaders/LogoSpinner';

const CreateTicketsPage = () =>
{
    const router = useRouter();
    const { eventSlug } = useParams();
    const { user } = useUser();
    const [ eventId, setEventId ] = useState<string | null>( null );
    const [ loading, setLoading ] = useState( true );
    const [ error, setError ] = useState<string | null>( null );

    useEffect( () =>
    {
        if ( !eventSlug ) return;

        const fetchEventId = async () =>
        {
            const id = await getEventIdBySlug( eventSlug as string );
            if ( !id )
            {
                setError( 'Event not found.' );
            } else
            {
                setEventId( id );
            }
            setLoading( false );
        };

        fetchEventId();
    }, [ eventSlug ] );

    if ( loading )
    {
        return <p className="text-gray-600"><LogoSpinner/></p>;
    }

    if ( error )
    {
        return <p className="text-red-600">{ error }</p>;
    }

    const handleCreateTickets = () =>
    {
        if ( eventId )
        {
            router.push(
                `/dashboard/${ encodeURIComponent( user?.orgName || '' ) }/create-event/${ eventId }/create-tickets`
            );
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Tickets for Event</h1>
            <div className="bg-white shadow rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                    Ready to create tickets for your event? Click the button below to proceed.
                </p>
                <button
                    onClick={ handleCreateTickets }
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Create Tickets
                </button>
            </div>
        </div>
    );
};

export default CreateTicketsPage;
