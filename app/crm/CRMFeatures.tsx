import {

    HeartIcon,
    UsersIcon,
    CalendarIcon,
    ChartBarIcon,
    ClipboardIcon,
    EnvelopeIcon
} from '@heroicons/react/24/outline';

const features = [
    {
        name: 'Attendee Management',
        description:
            'Efficiently manage attendee data, track registrations, and keep profiles up-to-date for seamless communication.',
        icon: UsersIcon
    },
    {
        name: 'Event Scheduling',
        description:
            'Organize and schedule your event activities with a detailed calendar view, ensuring everything runs smoothly.',
        icon: CalendarIcon
    },
    {
        name: 'Analytics & Reporting',
        description:
            'Gain insights into attendee engagement, ticket sales, and other key metrics with real-time reporting tools.',
        icon: ChartBarIcon
    },
    {
        name: 'Task Automation',
        description:
            'Automate routine tasks such as sending reminders, follow-up emails, and post-event surveys to save time and effort.',
        icon: ClipboardIcon
    },
    {
        name: 'Email Marketing Integration',
        description:
            'Integrate with popular email marketing platforms to send targeted campaigns and newsletters to your attendees.',
        icon: EnvelopeIcon
    },

    {
        name: 'Networking Tools',
        description:
            'Facilitate connections between attendees with built-in networking tools, allowing them to exchange contacts and set up meetings.',
        icon: HeartIcon
    }
];

export default function CRMFeatures() {
    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Comprehensive CRM for Event Organizers
                    </h2>
                </div>
                <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:max-w-none lg:grid-cols-3">
                    {features.map((feature) => (
                        <div key={feature.name} className="flex flex-col items-center text-center">
                            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
                                <feature.icon aria-hidden="true" className="h-6 w-6 text-white" />
                            </div>
                            <dt className="text-base font-semibold leading-7 text-gray-900">
                                {feature.name}
                            </dt>
                            <dd className="mt-1 text-base leading-7 text-gray-600">
                                {feature.description}
                            </dd>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
