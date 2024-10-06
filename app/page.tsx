import SvgBackgroundReversed from '@/components/Backgrounds/SquareSvgBackgroundReverse';
import SlantedDividerSolid from '@/components/Divider/SlantedDividerSolidProps';
import NavBar1 from '@/components/NavBarTW/NavBar1';
import FeaturesGridWithIcons from '@/components/Features/FeaturesGridwithIcons';
import FooterFull from '@/components/Footers/FooterFull';
import NavBarTW from '@/components/NavBarTW/NavBarTW';
import type { Metadata } from 'next';
import { getEvents } from './actions/getEvents'; // Server action or server-side fetching function
import HowItWorks from '@/components/Features/HowItWorks';
import FAQ_TW from '@/components/FAQ/FAQ_TW';

import { Button } from '@nextui-org/button';
import React from 'react';
import FreeServices from '@/components/free-service';
import FreeServiceAccordion from '@/components/free-services-accordion';


export const metadata: Metadata = {
    title: 'EventJacket - Simplified Event Management and Ticket Sales',
    description:
        'Boost ticket sales, simplify planning, and manage everything in one place with EventJacket. Whether your event is big or small, we’ve got you covered. Start for free today.',
    keywords: 'event management, ticket sales, event planning, nonprofit events, EventJacket, event software',
    robots: 'index, follow',
    alternates: {
        canonical: 'https://eventjacket.com/',
    },
    openGraph: {
        title: 'EventJacket - Simplified Event Management',
        description:
            'Take control of your event management with EventJacket. Manage vendors, volunteers, attendees, and more from one platform. Perfect for nonprofits and events of any size.',
        url: 'https://eventjacket.com/',
        type: 'website',
        images: [
            {
                url: 'https://eventjacket.com/images/og-image.png',
                width: 1200,
                height: 630,
                alt: 'EventJacket - Simplified Event Management',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        site: '@EventJacket',
        title: 'EventJacket - Simplified Event Management and Ticket Sales',
        description: 'Easily manage your event’s logistics with EventJacket, from ticket sales to volunteer coordination. Start today for free!',
    },
};


// Removed duplicate metadata declaration

export default async function Index ()
{
    // Fetch data directly in the server component
    const eventList = await getEvents(); // Ensure this fetches the latest data

    return (
        <>

            <SvgBackgroundReversed />
            <NavBar1 />
            <NavBarTW />

            <div className='mt-10'>
                <FreeServiceAccordion />
             </div>

            <HowItWorks />
            <SlantedDividerSolid color="#f1f5f9" height="81px" zIndex={ 2 } />

            <FeaturesGridWithIcons />

            <SlantedDividerSolid color="#f1f5f9" height="50px" flip invert zIndex={ 3 } />

            <FAQ_TW />

            {/* CTA section */ }
            <div className="bg-blue-700 ">
                <div className="mx-auto max-w-7xl px-6 py-12 lg:flex lg:items-center lg:justify-between lg:px-8 lg:py-24">
                    <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-yellow-400 to-yellow-300 sm:text-4xl">
                        <span className="block">Ready to dive in?</span>
                        <span className="block text-white">Start free today.</span>
                    </h2>
                    <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                        <div className="inline-flex rounded-3xl shadow-2xl">
                            <Button
                                as='a'
                                href="/signup"
                                className="inline-flex items-center px-6 py-3 text-xl font-semibold text-blue-800 bg-gradient-to-b from-yellow-400 to-yellow-300 hover:bg-yellow-400"
                            >
                                Get Started
                            </Button>
                        </div>
                    </div>
                </div>
            </div>



            <FooterFull />
        </>
    );
}
