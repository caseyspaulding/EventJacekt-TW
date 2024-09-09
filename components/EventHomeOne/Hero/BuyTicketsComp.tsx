'use client';

import React, { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardHeader, CardBody, CardFooter, Divider } from '@nextui-org/react';
import TicketPurchaseClient from '@/app/events/[eventSlug]/TicketPurchaseClient';

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

export const BuyTicketsComp: React.FC<MainBannerProps> = ( { eventName, tickets, eventSlug } ) =>
{
  const firstInputRef = useRef<HTMLInputElement | null>( null );

  // Create state for each ticket's quantity, identified by its ticket ID
  const [ quantities, setQuantities ] = useState<{ [ ticketId: string ]: number }>( {} );

  const handleQuantityChange = ( ticketId: string, newQuantity: number ) =>
  {
    setQuantities( ( prevQuantities ) => ( {
      ...prevQuantities,
      [ ticketId ]: newQuantity,
    } ) );
  };

  useEffect( () =>
  {
    if ( firstInputRef.current )
    {
      firstInputRef.current.focus();
    }
  }, [] );

  return (
    <div className="my-5 pb-10">
      <h2 className="mb-4 mt-4 text-4xl flex justify-center font-semibold text-grey-900">
        Available Tickets
      </h2>
      <div className="flex justify-center mb-4">
        {/* Use the first ticket's eventDate for the countdown */ }
        <Countdown startDate={ tickets[ 0 ].eventDate } />
      </div>

      { tickets.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          { tickets.map( ( ticket ) => (
            <Card
              shadow="lg"
              key={ ticket.id }
              className="border-none p-12 mb-8 text-grey-900 bg-background/20 dark:bg-default-100/50 w-full max-w-full mx-auto"
            >
              <CardHeader className="flex flex-col items-center">
                <h3 className="text-2xl text-grey-900 font-bold">{ eventName }</h3>
                <p className="text-small mt-2 text-grey-900">
                  Event Date: { ticket.eventDate ? new Date( ticket.eventDate ).toDateString() : 'No date available' }
                </p>
              </CardHeader>
              <Divider />
              <CardBody className="flex flex-col items-center">
                <p className="text-grey-900 text-xl text-center">{ ticket.description }</p>
                <p className="text-lg text-grey-900 font-semibold">
                  Price: ${ parseFloat( ticket.price ).toFixed( 2 ) }
                </p>
              </CardBody>
              <Divider />
              <CardFooter>
                <TicketPurchaseClient
                  ticket={ ticket }
                  eventSlug={ eventSlug }
                  quantity={ quantities[ ticket.id ] || 1 } // Pass the selected quantity
                  setQuantity={ ( newQuantity: number ) => handleQuantityChange( ticket.id, newQuantity ) } // Pass handleQuantityChange as setQuantity
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
