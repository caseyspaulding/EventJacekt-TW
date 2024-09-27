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
import Head from 'next/head';
import { Button } from '@nextui-org/button';


export const metadata: Metadata = {
    title: 'EventJacket - Homepage',
    description:
        'Boost ticket sales,simplify planning and manage everything in one place. For every event, big or small.',
};

export default async function Index ()
{
    // Fetch data directly in the server component
    const eventList = await getEvents(); // Ensure this fetches the latest data

    return (
        <>

            <SvgBackgroundReversed />
            <NavBar1 />
            <NavBarTW />



            <HowItWorks />
            <SlantedDividerSolid color="#f1f5f9" height="81px" zIndex={ 2 } />

            <FeaturesGridWithIcons />

            <SlantedDividerSolid color="#f1f5f9" height="50px" flip invert zIndex={ 3 } />

            <FAQ_TW />

            {/* CTA section */ }
            <div className="bg-blue-700 ">
                <div className="mx-auto max-w-7xl px-6 py-12 lg:flex lg:items-center lg:justify-between lg:px-8 lg:py-24">
                    <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-yellow-500 to-yellow-300 sm:text-4xl">
                        <span className="block">Ready to dive in?</span>
                        <span className="block text-white">Start free today.</span>
                    </h2>
                    <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                        <div className="inline-flex rounded-3xl shadow-2xl">
                            <Button
                                as='a'
                                href="/signup"
                                className="inline-flex items-center px-6 py-3 text-xl font-semibold text-blue-800 bg-yellow-500 hover:bg-yellow-400"
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
