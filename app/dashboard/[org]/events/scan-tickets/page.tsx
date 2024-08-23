'use client';

import React, { useState } from 'react';
import { fetchTicketInfo, checkInTicket } from './actions';
import QrCodeScanner from '@/components/QRCodeScanner/QRScanner';

interface ScannedTicket
{
  ticketId: string;
  eventId: string;
  name: string;
  checkInStatus: boolean;
  message: string;
}

export default function ScanTicketsPage ()
{
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
      const ticket = await fetchTicketInfo( ticketId );

      if ( !ticket )
      {
        throw new Error( 'Ticket not found' );
      }

      if ( ticket.checkInStatus )
      {
        setScannedTickets( ( prev ) => [
          {
            ticketId: ticket.id,
            eventId: ticket.eventName,
            name: ticket.name,
            checkInStatus: true,
            message: 'This ticket has already been used.',
          },
          ...prev.slice( 0, 4 ),
        ] );

        showVisualFeedback( 'error' );
        return;
      }

      const response = await checkInTicket( ticketId );

      if ( !response.success )
      {
        throw new Error( 'Failed to check in ticket' );
      }

      setScannedTickets( ( prev ) => [
        {
          ticketId: ticket.id,
          eventId: ticket.eventName,
          name: ticket.name,
          checkInStatus: true,
          message: 'Ticket successfully checked in.',
        },
        ...prev.slice( 0, 4 ),
      ] );

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

    const audio = new Audio( type === 'success' ? '/sounds/success-sound.mp3' : '/sounds/error-sound.mp3' );
    audio.play();

    setTimeout( () =>
    {
      setFeedbackType( null );
    }, 2000 );
  };

  return (
    <div className="max-w-md mx-auto  bg-white  overflow-hidden">
      <div className="p-6">
        <h1 className="text-4xl font-extrabold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500">
          Scan Tickets
        </h1>

        <QrCodeScanner
          qrCodeSuccessCallback={ handleScan }
          onError={ ( err ) =>
          {
            console.error( 'Scanner error:', err );
            setErrorMessage( 'Scanner error. Please try again.' );
          } }
        />

        { feedbackType && (
          <div className="mt-4 flex justify-center">
            { feedbackType === 'success' ? (
              <img src="/images/success-checkmark.png" alt="Success" width={ 500 } height={ 500 } />
            ) : (
              <img src="/images/error-cross.png" alt="Error" width={ 500 } height={ 500 } />
            ) }
          </div>
        ) }

        { errorMessage && <p className="text-center text-red-600 font-semibold mt-4">{ errorMessage }</p> }

        <div className="mt-6">
          <h2 className="text-xl text-center font-bold mb-2">Scanned Tickets Log</h2>
          <ul>
            { scannedTickets.map( ( ticket, index ) => (
              <li
                key={ index }
                className={ `p-2 ${ ticket.message === 'This ticket has already been used.' ? 'text-red-600' : 'text-green-600'
                  }` }
              >
                { ticket.message } - { ticket.name ? ticket.name : 'Unknown Ticket' }
              </li>
            ) ) }
          </ul>
        </div>
      </div>
    </div>
  );
}
