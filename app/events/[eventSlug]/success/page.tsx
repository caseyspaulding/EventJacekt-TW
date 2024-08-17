'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

type Params = {
  eventSlug: string;
};

interface SessionDetails
{
  id: string;
  amount_total: number;
  payment_status: string;
  customer_email?: string;
  // Add other properties that you might need
}

export default function SuccessPage ( { params }: { params: Params } )
{
  const { eventSlug } = params;
  const searchParams = useSearchParams();
  const sessionId = searchParams.get( 'session_id' );
  console.log( 'Session ID:', sessionId );
  console.log( 'Event Slug:', eventSlug );
  console.log( 'Search Params:', searchParams );


  const [ loading, setLoading ] = useState( true );
  const [ error, setError ] = useState<string | null>( null );



  if ( loading )
  {
    return <div>Loading...</div>;
  }

  if ( error )
  {
    return <div className="text-red-500">{ error }</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Success!</h1>
        <p className="text-lg mb-4">
          Thank you for purchasing a ticket to <span className="font-extrabold">{ eventSlug }</span>.
        </p>
        <p className="text-lg mb-4">
          Your ticket will be sent to your email address. Please check your inbox for further details.
        </p>





      </div>
    </div>
  );
}
