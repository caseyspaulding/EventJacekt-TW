import {
    ChartBarIcon,
    CurrencyDollarIcon,
    UserGroupIcon,
    ClipboardDocumentListIcon,
    PhoneIcon,
    TicketIcon
} from '@heroicons/react/24/outline';

const features = [
    {
        name: 'Ticket Sales Tracking',
        description:
            'Monitor ticket sales in real-time, track revenue, and analyze sales trends to optimize your event strategy.',
        icon: TicketIcon
    },
    {
        name: 'Attendee Demographics',
        description:
            'Get insights into your attendees with demographic data to better tailor your event experience and marketing efforts.',
        icon: UserGroupIcon
    },
    {
        name: 'Revenue Analytics',
        description:
            'Track and analyze your event’s financial performance, including ticket revenue, sponsorship income, and more.',
        icon: CurrencyDollarIcon
    },
    {
        name: 'Contact Information Management',
        description:
            'Efficiently manage and organize attendee contact information, making follow-ups and communication seamless.',
        icon: PhoneIcon
    },
    {
        name: 'Session Attendance Reports',
        description:
            'Analyze which sessions or activities were most popular with detailed attendance reports for each segment of your event.',
        icon: ClipboardDocumentListIcon
    },
    {
        name: 'Engagement Analytics',
        description:
            'Measure attendee engagement through various touchpoints, including interactions, feedback, and more.',
        icon: ChartBarIcon
    }
];

export default function AnalyticsFeatures() {
    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Powerful Analytics for Event Organizers
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
