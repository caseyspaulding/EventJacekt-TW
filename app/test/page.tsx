'use client';

import React, { useEffect, useState } from 'react';
import { generateCustomizedTicket } from '@/utils/generateCustomizedTicket'; // Adjust the import path as needed

const GenerateTicketTest = () =>
{
  const [ ticketImage, setTicketImage ] = useState<string | null>( null );

  useEffect( () =>
  {
    const generateTicket = async () =>
    {
      const ticketData = {
        customerName: 'John Doe',
        eventName: 'Really Great Concert',
        eventDate: 'October 14, 2025',
        eventTime: '4:00 pm',
        price: '70.00',
        address: 'Studio Shodwe, 123 Anywhere St, Any city',
        qrCodeText: 'https://www.example.com/verify/123456',
        ticketNumber: '0123456789',
      };

      try
      {
        const ticketUrl = await generateCustomizedTicket( ticketData );
        setTicketImage( ticketUrl );
      } catch ( error )
      {
        console.error( 'Error generating ticket:', error );
      }
    };

    generateTicket();
  }, [] );

  return (
    <div>
      <h1>Test Generated Ticket</h1>
      { ticketImage ? (
        <img src={ ticketImage } alt="Generated Ticket" />
      ) : (
        <p>Generating ticket...</p>
      ) }
    </div>
  );
};

export default GenerateTicketTest;
