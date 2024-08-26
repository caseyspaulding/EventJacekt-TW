'use client';

import React from "react";
import Countdown from "./Countdown";
import { Card, CardHeader, CardBody, CardFooter, Divider } from "@nextui-org/react";
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

const MainBanner: React.FC<MainBannerProps> = ( {
  eventName,
  eventSubtitle,
  eventDate,
  location,
  startDate,
  tickets,
  eventSlug,
} ) =>
{
  return (
    <div className="p-4">
      {/* Two-column Layout */ }
      <div className="relative z-10 max-w-screen-xl mx-auto flex flex-col lg:grid lg:grid-cols-[3fr_1fr] lg:gap-8">
        {/* Left Column: Event Information */ }
        <div className="flex flex-col justify-top rounded-md px-8 mb-8 lg:mb-0">
          <div className="">
            <h1 className="text-3xl md:text-5xl pt-4 font-bold text-grey-900 mb-4  lg:text-left">
              { eventName } <br />
              <span className="text-xl sm:text-2xl md:text-3xl">{ eventSubtitle }</span>
            </h1>
            <ul className="mb-6  lg:text-left">
              <li className="text-grey-900 text-lg">
                <i className="icofont-compass"></i> { location }
              </li>
              <li className="text-grey-900 text-lg">
                <i className="icofont-calendar"></i> { eventDate }
              </li>
            </ul>
            <div className="flex  lg:justify-start">
              <Countdown startDate={ startDate } />
            </div>
          </div>
        </div>

        {/* Right Column: Tickets Card */ }
        <div className="flex flex-col justify-center lg:pr-8">
          <h2 className="mb-4 mt-4 text-2xl text-center font-semibold text-grey-900 ">
            Available Tickets
          </h2>
          { tickets.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              { tickets.map( ( ticket ) => (
                <Card
                  shadow="sm"
                  isBlurred
                  key={ ticket.id }
                  className="border-none text-grey-900 bg-background/20 dark:bg-default-100/50 max-w-[400px] mx-auto"
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
        </div>
      </div>
    </div>
  );
};

export default MainBanner;
