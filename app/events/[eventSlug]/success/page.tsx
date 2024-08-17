'use client';

import { useSearchParams } from 'next/navigation';

type Params = {
  eventSlug: string;
};

export default function SuccessPage ( { params }: { params: Params } )
{
  const { eventSlug } = params;
  const searchParams = useSearchParams();
  const sessionId = searchParams.get( 'session_id' );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Success!</h1>
        <p className="text-lg mb-4">
          Thank you for purchasing a ticket to <span className="font-semibold">{ eventSlug }</span>.
        </p>
        <p className="text-sm text-gray-700 mb-6">
          Your session ID is: <span className="font-mono text-gray-800">{ sessionId }</span>
        </p>
        <p className="text-gray-600">You can add more details or fetch additional data using the session ID.</p>
      </div>
    </div>
  );
}
