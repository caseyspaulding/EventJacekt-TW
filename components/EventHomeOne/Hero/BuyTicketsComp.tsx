'use client';

import React, { useRef, useEffect } from 'react';
import Countdown from './Countdown';
import
  {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Divider,
    
  } from '@nextui-org/react';
import TicketPurchaseClient from '@/app/events/[eventSlug]/TicketPurchaseClient';

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

  startDate,
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

  return (
    <div className="p-4">
     
     
        

        {/* Right Column: Tickets Card */ }
        <div className="flex flex-col items-center lg:items-start p-9">
          <h2 className="mb-4 mt-4 text-2xl text-center justify-center font-semibold text-grey-900 ">
            Available Tickets
          </h2>
          { tickets.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              <div className="flex justify-center">
                <Countdown startDate={ startDate } />
              </div>
              { tickets.map( ( ticket ) => (
                <Card
                  shadow="sm"
                  key={ ticket.id }
                  className="border-none text-grey-900 bg-background/20 dark:bg-default-100/50 max-w-[400px] mx-auto"
                >
                  <CardHeader className="flex flex-col items-center">
                    <h3 className="text-xl text-grey-900 font-medium">{ ticket.name }</h3>
                    <p className="text-small text-grey-900">
                      Event Date: { ' ' }
                      { ticket.eventDate
                        ? new Date( ticket.eventDate ).toLocaleDateString()
                        : 'No date available' }
                    </p>
                  </CardHeader>
                  <Divider />
                  <CardBody className="flex flex-col items-center">
                    <p className="text-grey-900 text-center">{ ticket.description }</p>
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
                    />
                  </CardFooter>
                </Card>
              ) ) }
            </div>
          ) : (
            <p className="text-red-500">No tickets available for this event.</p>
          ) }
        </div>
      </div>
   
  );
};

export default BuyTicketsComp;
