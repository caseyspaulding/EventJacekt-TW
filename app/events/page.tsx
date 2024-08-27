// EventsList.tsx
import React from 'react';
import NavBar1 from '@/components/NavBarTW/NavBar1';
import FooterFull from '@/components/Footers/FooterFull';
import HeaderCentered from '@/components/HeaderCentered';
import EventsListComponent from '@/components/EventListComponent';
import { getEvents } from '@/app/actions/getEvents'; // Import the server action
import type { Metadata } from 'next/types';


export const revalidate = 10; // Revalidate the page every 10 seconds

export async function generateMetadata (): Promise<Metadata>
{
    return {
        title: 'Events - EventJacket',
        description: 'Explore the events organized with EventJacket.',
    };
}

const EventsList: React.FC = async () =>
{
    // Call the server action to fetch the events
    const eventList = await getEvents();

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

export default EventsList;
