'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getEventIdBySlug } from '../../../../actions/getEventIdBySlug';
import { useUser } from '@/contexts/UserContext';

const CreateTicketsPage = () => {
    const router = useRouter();
    const { eventSlug } = useParams();
    const { user } = useUser();
    const [eventId, setEventId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!eventSlug) return;

        const fetchEventId = async () => {
            const id = await getEventIdBySlug(eventSlug as string);
            if (!id) {
                setError('Event not found.');
            } else {
                setEventId(id);
            }
            setLoading(false);
        };

        fetchEventId();
    }, [eventSlug]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const handleCreateTickets = () => {
        if (eventId) {
            router.push(
                `/dashboard/${encodeURIComponent(user?.orgName || '')}/create-event/${eventId}/create-tickets`
            );
        }
    };

    return (
        <div>
            <h1>Create Tickets for Event</h1>
            <button onClick={handleCreateTickets}>Create Tickets</button>
        </div>
    );
};

export default CreateTicketsPage;
