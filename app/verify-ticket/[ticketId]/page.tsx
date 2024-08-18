'use client'; 

import React, { useState, useEffect } from 'react';
import { SubmitButton } from './Button';
import { fetchTicketInfo, checkInTicket } from './action'; // Import the server action

// Define the type for your ticket data
type Ticket = {
  id: string;
  name: string;
  status: string;
  eventName: string;
  validFrom: string | null;
  validUntil: string | null;
  purchaseDate: string | null;
  checkInStatus: string | null;
};

interface VerifyTicketPageProps
{
  params: {
    ticketId: string;
  };
}
export default function VerifyTicketPage ( { params }: VerifyTicketPageProps )
{
  const { ticketId } = params;
  const [ ticket, setTicket ] = useState<Ticket | null>( null ); // Explicitly set the type
  const [ isPending, setIsPending ] = useState( false );

  useEffect( () =>
  {
    const getTicketInfo = async () =>
    {
      try
      {
        const ticketData = await fetchTicketInfo( ticketId );
        setTicket( ticketData );
      } catch ( error )
      {
        console.error( 'Error fetching ticket info:', error );
      }
    };

    getTicketInfo();
  }, [ ticketId ] );

  if ( !ticket )
  {
    return <p className="text-center text-red-600 font-semibold mt-8">Loading ticket details...</p>;
  }

  if ( ticket.checkInStatus === 'checked_in' )
  {
    return (
      <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <p className="text-2xl font-bold mb-4 text-center text-red-600">This ticket has already been used.</p>
          <p className="text-lg text-gray-700 mb-2"><span className="font-semibold">Event:</span> { ticket.eventName }</p>
          <p className="text-lg text-gray-700 mb-2"><span className="font-semibold">Ticket Name:</span> { ticket.name }</p>
          <p className="text-lg text-gray-700 mb-2"><span className="font-semibold">Status:</span> { ticket.status }</p>
          <p className="text-lg text-gray-700 mb-6"><span className="font-semibold">Check-In Status:</span> { ticket.checkInStatus }</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Verify Ticket</h1>
        <p className="text-lg text-gray-700 mb-2"><span className="font-semibold">Event:</span> { ticket.eventName }</p>
        <p className="text-lg text-gray-700 mb-2"><span className="font-semibold">Ticket Name:</span> { ticket.name }</p>
        <p className="text-lg text-gray-700 mb-2"><span className="font-semibold">Status:</span> { ticket.status }</p>
        <p className="text-lg text-gray-700 mb-6"><span className="font-semibold">Check-In Status:</span> { ticket.checkInStatus }</p>

        <form action={ checkInTicket } >
          <input type="hidden" name="ticketId" value={ ticket.id } />
          <SubmitButton
            color="blue"
            pendingText="Checking In..."
            disabled={ isPending }
            onClick={ () => setIsPending( true ) }
            className="w-full bg-blue-600 px-0 py-px sm:w-auto"
          >
            Check-In
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}
