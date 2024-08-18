import {
    MegaphoneIcon,
    EnvelopeOpenIcon,
    PresentationChartLineIcon,
    HandThumbUpIcon,
    SparklesIcon,
    UsersIcon
} from '@heroicons/react/24/outline';

const features = [
    {
        name: 'Targeted Email Campaigns',
        description:
            'Create and send personalized email campaigns to specific attendee segments, boosting engagement and ticket sales.',
        icon: EnvelopeOpenIcon
    },
    {
        name: 'Social Media Promotion',
        description:
            'Leverage integrated tools to promote your event across social media platforms, expanding your event’s reach.',
        icon: MegaphoneIcon
    },
    {
        name: 'Marketing Analytics',
        description:
            'Track the performance of your marketing efforts with detailed analytics on reach, engagement, and conversions.',
        icon: PresentationChartLineIcon
    },
    {
        name: 'Referral Programs',
        description:
            'Encourage word-of-mouth marketing with customizable referral programs, rewarding attendees for bringing in new participants.',
        icon: HandThumbUpIcon
    },
    {
        name: 'Branding Customization',
        description:
            'Enhance your event’s branding with customizable templates for emails, landing pages, and promotional materials.',
        icon: SparklesIcon
    },
    {
        name: 'Audience Segmentation',
        description:
            'Segment your audience based on demographics, behavior, and preferences to deliver more relevant and effective marketing messages.',
        icon: UsersIcon
    }
];

export default function MarketingFeatures() {
    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Effective Marketing Tools for Event Organizers
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
