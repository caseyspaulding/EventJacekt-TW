import
{

    CheckIcon,


} from '@heroicons/react/24/outline';

import NavBar1 from '@/components/NavBarTW/NavBar1';

import HeaderCentered from '@/components/HeaderCentered';
import FooterFull from '@/components/Footers/FooterFull';
import type { Metadata } from 'next';
import { Button } from '@nextui-org/button';
import ComparisonTable from '@/components/ComparisonTable/ComparisonTable';

import FAQ_2 from '@/components/FAQ/FAQ_2';


export const metadata: Metadata = {
    title: 'Pricing - EventJacket',
    description: 'Learn more about EventJacket pricing plans and features.'
};


const features = [
    'Create and manage multiple events. ',
    'Customize event pages with your branding and logo.',
    'Sell tickets online and manage registrations.',
    'Capture attendee information and send event reminders.',

    'Generate QR codes for easy check-in and attendance tracking.',
    'Offer several types of tickets with different pricing',
    'Integrate with payment gateways for secure online ticket sales.',

    'Generate detailed reports and analytics on ticket sales and attendance.'
];

function classNames ( ...classes: string[] )
{
    return classes.filter( Boolean ).join( ' ' );
}

export default function Example ()
{
    return (
        <div className="bg-white">
            <NavBar1 />
            <HeaderCentered title="Pricing" description="" />
            <div className="bg-white">
                {/* Pricing section with single price and feature list */ }
                <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
                    <div className="pb-16 xl:flex xl:items-center xl:justify-between">
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                                <span className="text-gray-900">An Offer You Can't Refuse! </span>
                                <span className="ml-2 text-blue-600">$0 a month</span>
                            </h1>
                            <p className="mt-5 text-xl text-gray-500">
                                We must be crazy to give you a deal like this! Every feature included in every package, with no long-term commitments required!
                            </p>
                            <p className="mt-5 text-xl text-gray-500">

                            </p>
                        </div>
                        <Button
                            as='a'
                            href="/signup"
                            className="mt-8 shadow-2xl inline-flex rounded-3xl w-full items-center justify-center bg-yellow-500 hover:bg-yellow-500  px-8 py-3 text-lg font-medium text-white  sm:mt-10 sm:w-auto xl:mt-0"
                        >
                            Get Started
                        </Button>
                    </div>
                    <div className="border-t border-gray-200 pt-16 xl:grid xl:grid-cols-3 xl:gap-x-8">
                        <div>
                            <h2 className="text-lg font-semibold text-blue-600">
                                Everything you need
                            </h2>
                            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                                All-in-one platform
                            </p>
                            <p className="mt-4 text-lg text-gray-500"></p>
                        </div>
                        <div className="mt-4 sm:mt-8 md:mt-10 md:grid md:grid-cols-2 md:gap-x-8 xl:col-span-2 xl:mt-0">
                            <ul role="list" className="divide-y divide-gray-200">
                                { features.slice( 0, 5 ).map( ( feature, featureIdx ) => (
                                    <li
                                        key={ feature }
                                        className={ classNames(
                                            featureIdx === 0 ? 'md:py-0 md:pb-4' : '',
                                            'flex py-4'
                                        ) }
                                    >
                                        <CheckIcon
                                            aria-hidden="true"
                                            className="h-8 w-8 font-bold flex-shrink-0 text-yellow-500"
                                        />
                                        <span className="ml-3 text-base text-gray-500">
                                            { feature }
                                        </span>
                                    </li>
                                ) ) }
                            </ul>
                            <ul
                                role="list"
                                className="divide-y divide-gray-200 border-t border-gray-200 md:border-t-0"
                            >
                                { features.slice( 5 ).map( ( feature, featureIdx ) => (
                                    <li
                                        key={ feature }
                                        className={ classNames(
                                            featureIdx === 0 ? 'md:border-t-0 md:py-0 md:pb-4' : '',
                                            'flex py-4'
                                        ) }
                                    >
                                        <CheckIcon
                                            aria-hidden="true"
                                            className="h-8 w-8 flex-shrink-0 text-yellow-500"
                                        />
                                        <span className="ml-3 text-base text-gray-500">
                                            { feature }
                                        </span>
                                    </li>
                                ) ) }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            {/* Comparison table */ }

            <div className=''>
                <ComparisonTable />
            </div>

            {/* Branded FAQ */ }
            <div className="bg-blue-600">
                <div className="mx-auto max-w-7xl px-2 py-4 sm:py-8 lg:px-2">

                    <FAQ_2 />
                </div>
            </div>

            {/* CTA section */ }
            <div className="bg-white">
                <div className="mx-auto max-w-7xl px-6 py-12 lg:flex lg:items-center lg:justify-between lg:px-8 lg:py-24">
                    <h2 className="text-3xl font-bold tracking-tight text-yellow-500 sm:text-4xl">
                        <span className="block">Ready to dive in?</span>
                        <span className="block text-blue-600">Start free today.</span>
                    </h2>
                    <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                        <div className="inline-flex rounded-3xl shadow-2xl">
                            <Button
                                as='a'
                                href="/signup"
                                className="inline-flex items-center justify-center rounded-3xl border border-transparent bg-yellow-500 px-8 py-6 text-xl font-medium text-white hover:bg-green-600"
                            >
                                Get Started
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <FooterFull />
        </div>
    );
}
