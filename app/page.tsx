import SvgBackgroundReversed from '@/components/Backgrounds/SquareSvgBackgroundReverse';

import SlantedDividerSolid from '@/components/Divider/SlantedDividerSolidProps';
import { SlantedDivider } from '@/components/Divider/SlantedOverLap';
import NavBar1 from '@/components/NavBarTW/NavBar1';

import FeaturesGridWithIcons from '@components/Features/FeaturesGridwithIcons';
import FooterFull from '@components/Footers/FooterFull';
import NavBarTW from '@components/NavBarTW/NavBarTW';
import type { Metadata } from 'next';
import { getEvents } from './actions/getEvents';
import EventsListComponent from '@/components/EventListComponent';
import HowItWorks from '@/components/Features/HowItWorks';

import FAQ_TW from '@/components/FAQ/FAQ_TW';


export const metadata: Metadata = {
    title: 'EventJacket - Event Management Platform for Non-Profits',
    description:
        'EventJacket is your all-in-one event management solution, offering tools to create, manage, and sell tickets for events with ease. Perfect for organizers of conferences, festivals, and more.'
};
const eventList = await getEvents();
export default async function Index ()
{
    return (
        <>
            <SvgBackgroundReversed />
            <NavBar1 />

            <NavBarTW />
            <SlantedDividerSolid color="#f1f5f9" height="81px" zIndex={ 2 } />
           
            <FeaturesGridWithIcons />

            <SlantedDividerSolid color="#f1f5f9" height="50px" flip invert zIndex={ 3 } />
            <HowItWorks />
            
           <FAQ_TW />     
           
           
            <h2 className='text-center'>
                <span className="block text-base font-semibold text-gray-500 sm:text-lg lg:text-base xl:text-lg">
                    Coming soon
                </span>
                <span className="mt-1 block text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl">
                    <span className="block text-gray-900">Events on </span>
                    <span className="animate__animated animate__rubberBand block text-blue-600">EventJacket</span>
                </span>
            </h2>
            <EventsListComponent eventList={ eventList } />
            <SlantedDivider
                topColor="#1d4ed8"
                bottomColor="#1d4ed8" // Tailwind's blue-700 color
                gradient="linear-gradient(135deg, #1d4ed8, #1d4ed8)"
                height="52px"
                flip={ false } // Flip the slant if needed
                invert={ true } // Invert the angle if needed
                zIndex={ 1 } // Control stacking order
                overlap="-50px" // Control overlap between sections
            />
            <FooterFull />
        </>
    );
}
