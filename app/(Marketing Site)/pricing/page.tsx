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


export const metadata: Metadata = {
    title: 'Pricing - EventJacket',
    description: 'Learn more about EventJacket pricing plans and features.'
};


const features = [
    'Create and manage multiple events with customizable details and schedules.',
    'Send automated email invitations and reminders to attendees.',
    'Track RSVPs and manage guest lists in real-time.',
    'Generate QR codes for easy check-in and attendance tracking.',
    'Offer tiered ticket pricing and promotional codes for discounts.',
    'Integrate with payment gateways for secure online ticket sales.',
    'Provide interactive seating charts for assigned seating events.',
    'Create custom registration forms to collect attendee information.',
    'Offer a mobile-responsive event website for each event.',
    'Generate detailed reports and analytics on ticket sales and attendance.'
];
const faqs = [
    {
        id: 1,
        question: 'What types of events can I manage with EventJacket?',
        answer: 'EventJacket is versatile and can handle a wide range of events, including conferences, workshops, concerts, weddings, and corporate gatherings. Our platform is designed to accommodate both small intimate events and large-scale productions.'
    },
    {
        id: 2,
        question: 'How does EventJacket handle ticket sales and payments?',
        answer: 'EventJacket integrates with popular payment gateways to process ticket sales securely. You can set up various ticket types, pricing tiers, and even offer promotional codes. Funds are typically transferred to your linked bank account within 2-5 business days after the event.'
    },
    {
        id: 3,
        question: 'Can I customize the registration form for my event?',
        answer: 'Yes, EventJacket allows you to create custom registration forms. You can add fields to collect specific information from attendees, such as dietary requirements, session preferences, or any other details relevant to your event.'
    },
    {
        id: 4,
        question: 'How does the check-in process work with EventJacket?',
        answer: 'EventJacket provides a streamlined check-in process using QR codes. Attendees receive a unique QR code with their ticket, which can be scanned using our mobile app or a compatible device at the event entrance for quick and efficient check-in.'
    },
    {
        id: 5,
        question: 'What kind of reports and analytics does EventJacket offer?',
        answer: 'EventJacket provides comprehensive reporting features, including real-time ticket sales data, attendance tracking, revenue summaries, and attendee demographics. You can also generate custom reports to gain insights specific to your event needs.'
    },
    {
        id: 6,
        question: 'Is it possible to manage multiple events simultaneously on EventJacket?',
        answer: 'Yes, EventJacket is designed to handle multiple events concurrently. You can create, manage, and track numerous events from a single dashboard, making it ideal for event planners, organizations, or venues that host various events.'
    }
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
                                <span className="text-gray-900">Simple no-tricks pricing.</span>
                                <span className="ml-2 text-blue-600">$0.00 a month</span>
                            </h1>
                            <p className="mt-5 text-xl text-gray-500">
                                50 cents per event ticket sold.
                            </p>
                            <p className="mt-5 text-xl text-gray-500">
                             
                            </p>
                        </div>
                        <Button
                            as='a'
                            href="/signup"
                            className="mt-8 shadow-2xl inline-flex rounded-3xl w-full items-center justify-center bg-orange-500 hover:bg-green-500  px-5 py-3 text-base font-medium text-white  sm:mt-10 sm:w-auto xl:mt-0"
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
                                            className="h-8 w-8 font-bold flex-shrink-0 text-green-500"
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
                                            className="h-6 w-6 flex-shrink-0 text-green-500"
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
            <div className="bg-blue-700">
                <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
                    <h2 className="text-3xl font-bold tracking-tight text-white">
                        Frequently Asked Questions
                    </h2>
                    <div className="mt-6 border-t border-blue-400 border-opacity-25 pt-10">
                        <dl className="space-y-10 md:grid md:grid-cols-2 md:grid-rows-2 md:gap-x-8 md:gap-y-12 md:space-y-0">
                            { faqs.map( ( item ) => (
                                <div key={ item.id }>
                                    <dt className="text-lg font-medium leading-6 text-white">
                                        { item.question }
                                    </dt>
                                    <dd className="mt-2 text-base text-blue-100">{ item.answer }</dd>
                                </div>
                            ) ) }
                        </dl>
                    </div>
                </div>
            </div>

            {/* CTA section */ }
            <div className="bg-white">
                <div className="mx-auto max-w-7xl px-6 py-12 lg:flex lg:items-center lg:justify-between lg:px-8 lg:py-24">
                    <h2 className="text-3xl font-bold tracking-tight text-orange-600 sm:text-4xl">
                        <span className="block">Ready to dive in?</span>
                        <span className="block text-blue-600">Start your free trial today.</span>
                    </h2>
                    <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                        <div className="inline-flex rounded-3xl shadow-2xl">
                            <Button
                                as='a'
                                href="/signup"
                                className="inline-flex items-center justify-center rounded-3xl border border-transparent bg-orange-500 px-5 py-3 text-base font-medium text-white hover:bg-green-600"
                            >
                                Get started
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <FooterFull />
        </div>
    );
}
