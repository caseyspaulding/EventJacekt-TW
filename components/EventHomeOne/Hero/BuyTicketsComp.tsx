'use client';

import React, { useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import
  {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Divider,
  } from '@nextui-org/react';
import TicketPurchaseClient from '@/app/events/[eventSlug]/TicketPurchaseClient';
import { generateCustomizedTicket } from '@/utils/generateCustomizedTicket'; // Import your helper function

const Countdown = dynamic( () => import( '../../Countdown/Countdown' ), {
  ssr: false, // Disable SSR for this component
} );

interface Ticket
{
  id: string;
  eventId: string;
  orgId: string;
  name: string;
  description: string | null;
  price: string;
  quantity: number;
  eventDate: string;
  saleStartDate: string;
  saleEndDate: string;
  isEarlyBird: boolean | null;
  maxPerCustomer: number | null;
  isFree: boolean | null;
  category: string;
  promoCodeRequired: boolean | null;
  availableOnline: boolean | null;
  groupDiscountAvailable: boolean | null;
  refundable: boolean | null;
  currency: string;
  salesLimitPerDay: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface MainBannerProps
{
  eventName: string;
  eventSubtitle: string;
  eventDate: string;
  location: string;
  startDate: string;
  tickets: Ticket[];
  eventSlug: string;
}

export const BuyTicketsComp: React.FC<MainBannerProps> = ( {
  eventName,
  tickets,
  eventSlug,
} ) =>
{
  const firstInputRef = useRef<HTMLInputElement | null>( null );

  useEffect( () =>
  {
    if ( firstInputRef.current )
    {
      firstInputRef.current.focus();
    }
  }, [] );

  // Handler for ticket purchase completion
  const handleTicketPurchase = async ( buyer: { email: string; firstName: string }, ticket: Ticket, ) =>
  {
    try
    {
      // Call generateCustomizedTicket to create a customized ticket
      const ticketImage = await generateCustomizedTicket( {
        customerName: buyer.firstName,
        eventName,
        eventDate: new Date( ticket.eventDate ).toLocaleDateString(),
        eventTime: `${ ticket }, `,  // Example time; replace with actual if available
        price: parseFloat( ticket.price ).toFixed( 2 ),
        address: `${ location }`,
        qrCodeText: `https://eventjacket.com/verify-ticket/${ ticket.id }`,
        ticketNumber: "123456789" // Example ticket number; replace with actual if available
      } );

      console.log( 'Generated Ticket Image:', ticketImage );

      // Here you could send the image via email or display in the UI
    } catch ( error )
    {
      console.error( 'Error generating customized ticket:', error );
    }
  };

  return (
    <div className="my-5 pb-10 ">
      <h2 className="mb-4 mt-4 text-4xl flex justify-center font-semibold text-grey-900">
        Available Tickets
      </h2>
      <div className="flex justify-center mb-4">
        {/* Use the first ticket's eventDate for the countdown */ }
        <Countdown startDate={ tickets[ 0 ].eventDate } />
      </div>

      { tickets.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* The grid will have 1 column on small screens, 2 on medium, and 3 on large screens */ }

          { tickets.map( ( ticket ) => (
            <Card
              shadow="lg"
              key={ ticket.id }
              className="border-none p-12 mb-8 text-grey-900 bg-background/20 dark:bg-default-100/50 w-full max-w-full mx-auto"
            >
              <CardHeader className="flex flex-col items-center">
                <h3 className="text-2xl text-grey-900 font-bold">{ eventName }</h3>

                <p className="text-small mt-2 text-grey-900">
                  Event Date:{ ' ' }
                  { ticket.eventDate
                    ? new Date( ticket.eventDate ).toDateString()
                    : 'No date available' }
                </p>
              </CardHeader>
              <Divider />
              <CardBody className="flex flex-col items-center">
                <p className="text-grey-900 text-xl text-center">
                  { ticket.description }
                </p>
                <p className="text-lg text-grey-900 font-semibold">
                  Price: ${ parseFloat( ticket.price ).toFixed( 2 ) }
                </p>
              </CardBody>
              <Divider />
              <CardFooter>
                <TicketPurchaseClient
                  ticket={ ticket }
                  eventSlug={ eventSlug }
                  ref={ firstInputRef } // Pass ref to input field
                  onPurchaseComplete={ ( buyer ) => handleTicketPurchase( buyer, ticket ) } // Handle purchase completion
                />
              </CardFooter>
            </Card>
          ) ) }
        </div>
      ) : (
        <p className="text-red-500">No tickets available for this event.</p>
      ) }
    </div>
  );
};

export default BuyTicketsComp;
