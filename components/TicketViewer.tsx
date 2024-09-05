// components/TicketDisplay.tsx

'use client';

import { useState, useEffect } from 'react';
import { generateCustomizedTicket } from '@/utils/generateCustomizedTicket'; // Ensure this is the correct path

interface TicketDisplayProps
{
  eventName: string;
  eventDate: string;
  eventTime: string;
  price: string;
  address: string;
  ticketNumber: string;
}

const TicketDisplay: React.FC<TicketDisplayProps> = ( {
  eventName,
  eventDate,
  eventTime,
  price,
  address,
  ticketNumber,
} ) =>
{
  const [ ticketImage, setTicketImage ] = useState<string | null>( null );

  useEffect( () =>
  {
    // Generate the ticket image
    const generateTicket = async () =>
    {
      const ticketUrl = await generateCustomizedTicket( {
        customerName: 'John Doe', // Replace with actual customer data
        eventName,
        eventDate,
        eventTime,
        price,
        address,
        qrCodeText: `https://eventjacket.com/verify-ticket/${ ticketNumber }`,
        ticketNumber,
      } );

      setTicketImage( ticketUrl );
    };

    generateTicket();
  }, [ eventName, eventDate, eventTime, price, address, ticketNumber ] );

  return (
    <div>
      { ticketImage ? (
        <img src={ ticketImage } alt="Customized Ticket" className="max-w-full h-auto" />
      ) : (
        <p>Loading ticket...</p>
      ) }
    </div>
  );
};

export default TicketDisplay;
