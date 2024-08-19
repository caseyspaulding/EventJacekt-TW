'use client';

import React, { useState, useEffect, useRef } from 'react';
import { fetchTicketInfo } from './action';
import { SubmitButton } from '@/app/login/submit-button';
import { Html5QrcodeScanner } from 'html5-qrcode';

type Ticket = {
  id: string;
  name: string;
  status: string;
  eventName: string;
  purchaseDate: string | null;
  checkInStatus: string | null;
};

export default function VerifyTicketPage ( { params }: { params: { ticketId: string } } )
{
  const { ticketId } = params;
  const [ ticket, setTicket ] = useState<Ticket | null>( null );
  const [ isPending, setIsPending ] = useState( false );
  const [ errorMessage, setErrorMessage ] = useState<string | null>( null );
  const qrScannerInitialized = useRef( false );  // Use a ref to track initialization
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
    // Prevent multiple check-ins for the same ticket
    if ( ticket?.checkInStatus === 'checked_in' || lastProcessedTicketId.current === id )
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
        throw new Error( 'Failed to check in ticket' );
      }

      const result = await response.json();
      console.log( 'Check-In Result:', result );

      // Update ticket status to 'checked-in'
      setTicket( ( prevTicket ) =>
        prevTicket ? { ...prevTicket, checkInStatus: 'checked_in' } : prevTicket
      );
    } catch ( error )
    {
      console.error( 'Error during check-in:', error );
      setErrorMessage( 'Failed to check in the ticket. Please try again.' );
    } finally
    {
      setIsPending( false );
    }
  };

  useEffect( () =>
  {
    if ( !qrScannerInitialized.current && ticket )
    {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: 250 },
        false
      );

      scanner.render(
        async ( decodedText: string ) =>
        {
          console.log( `Scanned QR Code: ${ decodedText }` );
          await handleCheckIn( decodedText );
        },
        ( error: string ) =>
        {
          console.warn( `QR Code scan error: ${ error }` );
        }
      );

      qrScannerInitialized.current = true;  // Ensure the scanner is only initialized once
    }
  }, [ ticket ] );  // This should only run once when the ticket is first loaded

  if ( errorMessage )
  {
    return <p className="text-center text-red-600 font-semibold mt-8">{ errorMessage }</p>;
  }

  if ( isPending && !ticket )
  {
    return <p className="text-center text-red-600 font-semibold mt-8">Loading ticket details...</p>;
  }

  if ( ticket?.checkInStatus === 'checked_in' )
  {
    return (
      <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <p className="text-2xl font-bold mb-4 text-center text-red-600">This ticket has already been used.</p>
          <p className="text-lg text-gray-700 mb-2"><span className="font-semibold">Event:</span> { ticket.eventName }</p>
          <p className="text-lg text-gray-700 mb-2"><span className="font-semibold">Ticket Name:</span> { ticket.name }</p>
          <p className="text-lg text-gray-700 mb-2"><span className="font-semibold">Status:</span> { ticket.status }</p>
          <p className="text-lg text-gray-700 mb-2"><span className="font-semibold">Check-In Status:</span> { ticket.checkInStatus }</p>
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
        <p className="text-lg text-gray-700 mb-2"><span className="font-semibold">Check-In Status:</span> { ticket?.checkInStatus }</p>
        <div id="qr-reader" style={ { width: '100%' } }></div>

        <SubmitButton
          onClick={ () => handleCheckIn( ticketId ) }
          color="blue"
          disabled={ isPending || ticket?.checkInStatus === 'checked_in' }
          className="w-full mt-4"
        >
          { isPending ? 'Checking in...' : 'Check In Ticket' }
        </SubmitButton>
      </div>
    </div>
  );
}
