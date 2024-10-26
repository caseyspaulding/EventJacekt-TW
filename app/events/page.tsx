
'use client';
import NavBar1 from '@/components/NavBarTW/NavBar1';
import FooterFull from '@/components/Footers/FooterFull';
import HeaderCentered from '@/components/HeaderCentered';
import EventsListComponent from '@/components/EventListComponent';
import { getEvents } from '@/app/actions/getEvents'; // Import the server action

import { useEffect, useState } from 'react';

export const revalidate = 10; // Revalidate the page every 10 seconds


// Create an async function to fetch events
async function fetchEventList ()
{
    return await getEvents();
}

// Wrapper component to manage async data fetching and rendering
const EventsListWrapper: React.FC = () =>
{
    const [ eventList, setEventList ] = useState<any[]>( [] );
    const [ loading, setLoading ] = useState( true );

    useEffect( () =>
    {
        const fetchData = async () =>
        {
            const events = await fetchEventList();
            setEventList( events );
            setLoading( false );
        };
        fetchData();
    }, [] );

    if ( loading )
    {
        return <div>Loading Events...</div>;
    }

    return (
        <>
            <NavBar1 />
            <HeaderCentered
                title="Events"
                description="Explore the events organized with EventJacket."
            />
            <EventsListComponent eventList={ eventList } />
            <FooterFull />
        </>
    );
};

export default EventsListWrapper;
