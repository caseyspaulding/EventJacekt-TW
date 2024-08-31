import SvgBackgroundReversed from '@/components/Backgrounds/SquareSvgBackgroundReverse';
import SlantedDividerSolid from '@/components/Divider/SlantedDividerSolidProps';
import NavBar1 from '@/components/NavBarTW/NavBar1';
import FeaturesGridWithIcons from '@/components/Features/FeaturesGridwithIcons';
import FooterFull from '@/components/Footers/FooterFull';
import NavBarTW from '@/components/NavBarTW/NavBarTW';
import type { Metadata } from 'next';
import { getEvents } from './actions/getEvents'; // Server action or server-side fetching function
import EventsListComponent from '@/components/EventListComponent';
import HowItWorks from '@/components/Features/HowItWorks';
import FAQ_TW from '@/components/FAQ/FAQ_TW';
import Head from 'next/head';

export const metadata: Metadata = {
    title: 'EventJacket - Event Management Software',
    description:
        'Simplify planning, boost ticket sales, and manage everything in one place. For every event, big or small',
};

export default async function Index ()
{
    // Fetch data directly in the server component
    const eventList = await getEvents(); // Ensure this fetches the latest data

    return (
        <>
            <Head>
               
                <meta property="og:title" content="EventJacket - Event Management Software" />
                <meta
                    property="og:description"
                    content="Simplify planning, boost ticket sales, and manage everything in one place. For every event, big or small"
                />
                <meta property="og:url" content="https://www.eventjacket.com" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://www.eventjacket.com/opengraph-image.png" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:alt" content="EventJacket - Your Event Management Solution" />

                {/* Optional - Facebook App ID */ }
                {/* <meta property="fb:app_id" content="YOUR_FACEBOOK_APP_ID" /> */ }
            </Head>
            <SvgBackgroundReversed />
            <NavBar1 />
            <NavBarTW />
            <HowItWorks />
            <SlantedDividerSolid color="#f1f5f9" height="81px" zIndex={ 2 } />

            <FeaturesGridWithIcons />

            <SlantedDividerSolid color="#f1f5f9" height="50px" flip invert zIndex={ 3 } />

            <FAQ_TW />

            <h2 className="text-center">
                <span className="block text-base font-semibold text-gray-500 sm:text-lg lg:text-base xl:text-lg">
                    Just Launched
                </span>
                <span className="mt-1 block text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl">
                    <span className="block text-gray-900">Events on </span>
                    <span className="animate__animated animate__rubberBand block text-blue-600">EventJacket</span>
                </span>
            </h2>
            <EventsListComponent eventList={ eventList } />

            <FooterFull />
        </>
    );
}
