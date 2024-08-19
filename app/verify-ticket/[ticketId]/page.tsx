'use client';

import React, { useState, useEffect, useRef } from 'react';
import { fetchTicketInfo } from './action';
import { SubmitButton } from '@/app/login/submit-button';
import Html5QrcodePlugin from '@/components/QRCodeScanner/Html5QrCodePlugin';

type Ticket = {
  id: string;
  name: string;
  status: string;
  eventName: string;
  purchaseDate: string | null;
  checkInStatus: boolean | null;  // Updated to boolean
};

export default function VerifyTicketPage ( { params }: { params: { ticketId: string } } )
{
  const { ticketId } = params;
  const [ ticket, setTicket ] = useState<Ticket | null>( null );
  const [ isPending, setIsPending ] = useState( false );
  const [ errorMessage, setErrorMessage ] = useState<string | null>( null );
  const lastProcessedTicketId = useRef<string | null>( null );

  useEffect( () =>
  {
    const getTicketInfo = async () =>
    {
      try
      {
        setIsPending( true );
        const ticketData = await fetchTicketInfo( ticketId );
        setTicket( ticketData );
        setIsPending( false );
      } catch ( error )
      {
        console.error( 'Error fetching ticket info:', error );
        setErrorMessage( 'Failed to load ticket details.' );
        setIsPending( false );
      }
    };

    getTicketInfo();
  }, [ ticketId ] );

  const handleCheckIn = async ( id: string ) =>
  {
    if ( ticket?.checkInStatus || lastProcessedTicketId.current === id )
    {
      return;
    }

    lastProcessedTicketId.current = id;
    setIsPending( true );

    try
    {
      const response = await fetch( `/api/tickets/check-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( { ticketId: id } ),
      } );

      if ( !response.ok )
      {
        const errorData = await response.json();
        throw new Error( errorData.error || 'Failed to check in ticket' );
      }

      const result = await response.json();
      console.log( 'Check-In Result:', result );

      setTicket( ( prevTicket ) => ( prevTicket ? { ...prevTicket, checkInStatus: true } : prevTicket ) );
    } catch ( error )
    {
      console.error( 'Error during check-in:', error );
      setErrorMessage( 'Failed to check in the ticket. Please try again.' );
    } finally
    {
      setIsPending( false );
    }
  };

  if ( errorMessage )
  {
    return <p className="text-center text-red-600 font-semibold mt-8">{ errorMessage }</p>;
  }

  if ( isPending && !ticket )
  {
    return <p className="text-center text-red-600 font-semibold mt-8">Loading ticket details...</p>;
  }

  if ( ticket?.checkInStatus )
  {
    return (
      <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <p className="text-2xl font-bold mb-4 text-center text-red-600">This ticket has already been used.</p>
          <p className="text-lg text-gray-700 mb-2"><span className="font-semibold">Event:</span> { ticket.eventName }</p>
          <p className="text-lg text-gray-700 mb-2"><span className="font-semibold">Ticket Name:</span> { ticket.name }</p>
          <p className="text-lg text-gray-700 mb-2"><span className="font-semibold">Status:</span> { ticket.status }</p>
          <p className="text-lg text-gray-700 mb-2"><span className="font-semibold">Check-In Status:</span> { ticket.checkInStatus ? 'checked_in' : 'not_checked_in' }</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Verify Ticket</h1>
        <p className="text-lg text-gray-700 mb-2"><span className="font-semibold">Event:</span> { ticket?.eventName }</p>
        <p className="text-lg text-gray-700 mb-2"><span className="font-semibold">Ticket Name:</span> { ticket?.name }</p>
        <p className="text-lg text-gray-700 mb-2"><span className="font-semibold">Status:</span> { ticket?.status }</p>
        <p className="text-lg text-gray-700 mb-2"><span className="font-semibold">Check-In Status:</span> { ticket?.checkInStatus ? 'checked_in' : 'not_checked_in' }</p>

        <div id="qr-reader" style={ { width: '100%' } }>
          <Html5QrcodePlugin
            fps={ 10 }
            qrbox={ 250 }
            disableFlip={ false }
            qrCodeSuccessCallback={ handleCheckIn }
          />
        </div>

        <SubmitButton
          onClick={ () => handleCheckIn( ticketId ) }
          color="blue"
          disabled={ isPending || !!ticket?.checkInStatus }
          className="w-full mt-4"
        >
          { isPending ? 'Checking in...' : 'Check In Ticket' }
        </SubmitButton>
      </div>
    </div>
  );
}
