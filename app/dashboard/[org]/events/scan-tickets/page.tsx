'use client';

import React, { useState } from 'react';
import Html5QrcodePlugin from '@/components/QRCodeScanner/Html5QrCodePlugin';


type ScannedTicket = {
  ticketId: string;
  eventId: string;
  name: string;
  checkInStatus: boolean;
  message: string;
};

export default function ScanTicketsPage ( { params }: { params: { orgId: string } } )
{
  const { orgId } = params;
  const [ scannedTickets, setScannedTickets ] = useState<ScannedTicket[]>( [] );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ isPending, setIsPending ] = useState( false );
  const [ errorMessage, setErrorMessage ] = useState<string | null>( null );
  const [ feedbackType, setFeedbackType ] = useState<'success' | 'error' | null>( null );

  const handleScan = async ( ticketUrl: string ) =>
  {
    const ticketId = extractTicketIdFromUrl( ticketUrl );
    if ( !ticketId )
    {
      setErrorMessage( 'Invalid QR code scanned.' );
      showVisualFeedback( 'error' );
      return;
    }

    setIsPending( true );
    setErrorMessage( null );

    try
    {
      const response = await fetch( '/api/tickets/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { ticketId, orgId } ),
      } );

      if ( !response.ok )
      {
        const errorData = await response.json();
        throw new Error( errorData.error || 'Failed to check in ticket' );
      }

      const result = await response.json();
      console.log( 'Check-In Result:', result );

      setScannedTickets( ( prev ) => [
        {
          ticketId: result.id,
          eventId: result.eventId,
          name: result.name,
          checkInStatus: true,
          message: 'Ticket successfully checked in.',
        },
        ...prev.slice( 0, 4 ), // Keep only the last 5 scanned tickets
      ] );

      // Show success visual feedback
      showVisualFeedback( 'success' );
    } catch ( error )
    {
      console.error( 'Error during check-in:', error );
      setErrorMessage( 'Failed to check in the ticket. Please try again.' );

      setScannedTickets( ( prev ) => [
        {
          ticketId,
          eventId: '',
          name: '',
          checkInStatus: false,
          message: 'Failed to check in the ticket.',
        },
        ...prev.slice( 0, 4 ),
      ] );

      // Show error visual feedback
      showVisualFeedback( 'error' );
    } finally
    {
      setIsPending( false );
    }
  };

  const extractTicketIdFromUrl = ( url: string ): string | null =>
  {
    const match = url.match( /\/verify-ticket\/([a-f0-9-]+)/ );
    return match ? match[ 1 ] : null;
  };

  const showVisualFeedback = ( type: 'success' | 'error' ) =>
  {
    setFeedbackType( type );
    // Hide feedback after 2 seconds
    setTimeout( () =>
    {
      setFeedbackType( null );
    }, 2000 );
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Scan Tickets</h1>

        <div id="qr-reader" style={ { width: '100%' } }>
          <Html5QrcodePlugin
            fps={ 10 }
            qrbox={ 250 }
            disableFlip={ false }
            qrCodeSuccessCallback={ handleScan }
          />
        </div>

        { feedbackType && (
          <div className="mt-4 flex justify-center">
            { feedbackType === 'success' ? (
              <img src="/images/success-checkmark.png" alt="Success" width={ 50 } height={ 50 } />
            ) : (
              <img src="/images/error-cross.png" alt="Error" width={ 50 } height={ 50 } />
            ) }
          </div>
        ) }

        { errorMessage && (
          <p className="text-center text-red-600 font-semibold mt-4">{ errorMessage }</p>
        ) }

        {/* Display a summary of the last few scanned tickets */ }
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-2">Scanned Tickets</h2>
          <ul>
            { scannedTickets.map( ( ticket, index ) => (
              <li key={ index } className={ `p-2 ${ ticket.checkInStatus ? 'text-green-600' : 'text-red-600' }` }>
                { ticket.message } - { ticket.name ? ticket.name : 'Unknown Ticket' }
              </li>
            ) ) }
          </ul>
        </div>
      </div>
    </div>
  );
}
