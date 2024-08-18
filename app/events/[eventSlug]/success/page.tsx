'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from 'flowbite-react/components/Button';

type Params = {
    eventSlug: string;
};



export default function SuccessPage({ params }: { params: Params }) {
    const { eventSlug } = params;
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    console.log('Session ID:', sessionId);
    console.log('Event Slug:', eventSlug);
    console.log('Search Params:', searchParams);

    const [error] = useState<string | null>(null);

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
            <div className="w-full max-w-lg rounded-lg bg-white p-8 text-center shadow-md">
                <h1 className="mb-4 text-4xl font-extrabold text-green-600">Success!</h1>
                <p className="mb-4 text-2xl">
                    Thank you for purchasing a ticket to{' '}
                    <span className="font-extrabold">{eventSlug}</span>.
                </p>
                <p className="mb-4 text-lg">
                    Your ticket will be sent to your email address. Please check your inbox for
                    further details.
                </p>

                <Button href="/" color="blue" className="text-white">
                    Back to Home
                </Button>
            </div>
        </div>
    );
}
