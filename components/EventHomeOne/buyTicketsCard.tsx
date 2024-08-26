

import React from "react";

import { Card } from "@nextui-org/card";
import { CardHeader } from "@nextui-org/card";
import { CardBody } from "@nextui-org/card";
import { CardFooter } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import TicketPurchaseClient from "@/app/events/[eventSlug]/TicketPurchaseClient";

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
  bannerImages: string[];
  startDate: string;
  tickets: Ticket[];
  eventSlug: string;
}

const BuyTicketsCard: React.FC<MainBannerProps> = ( {

  tickets,
  eventSlug,
} ) =>
{
  return (
    
     <>
    
   
        <h2 className="mb-4 text-2xl text-center font-semibold text-grey-900 ">
          Available Tickets
        </h2>
        { tickets.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            { tickets.map( ( ticket ) => (
              <Card
                shadow="sm"
                isBlurred
                key={ ticket.id }
                className="border-none text-grey-900 bg-background/20 dark:bg-default-100/50 max-w-[400px]"
              >
                <CardHeader className="flex flex-col items-center">
                  <h3 className="text-xl text-grey-900 font-medium">{ ticket.name }</h3>
                  <p className="text-small text-grey-900 ">
                    Event Date:{ " " }
                    { ticket.eventDate
                      ? new Date( ticket.eventDate ).toLocaleDateString()
                      : "No date available" }
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
                  <TicketPurchaseClient ticket={ ticket } eventSlug={ eventSlug } />
                </CardFooter>
              </Card>
            ) ) }
          </div>
        ) : (
          <p className="text-red-500">No tickets available for this event.</p>
        ) }
    
    </>
  );
};

export default BuyTicketsCard;
