"use client";

import React from "react";

import { Card, CardHeader, CardBody, CardFooter, Divider } from "@nextui-org/react";
import "@/styles/style.css";
import "@/styles/responsive.css";
import "@/styles/animate.min.css";
import TicketPurchaseClient from "@/app/events/[eventSlug]/TicketPurchaseClient";
import Countdown2 from "./Hero/CountDown2";

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

const SlideShow: React.FC<MainBannerProps> = ( {
  eventName,
  eventSubtitle,
  eventDate,
  location,
  bannerImages,
  startDate,
  tickets,
  eventSlug,
} ) =>
{
  return (
    <div className="main-banner slideshow-banner py-24">



      {/* Two-column Layout */ }
      <div className="relative z-10 max-w-screen-xl mx-auto lg:grid lg:grid-cols-[3fr_1fr] lg:gap-8">
        {/* Left Column: Event Information */ }
        <div className="flex flex-col items-center justify-center p-6 bg-opacity-50  backdrop-filter backdrop-blur-sm rounded-md">
          <div className="">
            <Countdown2 startDate={ startDate } />

            <h1 className="text-5xl pt-4 font-bold  mb-4">
              { eventName } <br /> <span className="text-xl sm:text-2xl md:text-3xl">{ eventSubtitle }</span>
            </h1>

            <ul className="mb-6">
              <li className="text-grey-700 text-lg">
                <span className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={ 1.5 } stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>

                  <span>{ location }</span>

                </span>
              </li>
              <li className="text-grey-700 text-lg">
                <span className="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={ 1.5 }
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                    />
                  </svg>
                  <span>{ eventDate }</span>
                </span>
              </li>

            </ul>
          </div>
        </div>

        {/* Right Column: Tickets Card */ }
        <div className="p-6">
          <h2 className="mb-4 text-2xl text-center font-semibold text-grey-700 ">
            Available Tickets
          </h2>
          { tickets.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              { tickets.map( ( ticket ) => (
                <Card shadow="sm" isBlurred key={ ticket.id } className="border-none text-grey-700 bg-background/80 dark:bg-default-100/50 max-w-[400px]">
                  <CardHeader className="flex flex-col items-center">
                    <h3 className="text-xl text-grey-700 font-medium">{ ticket.name }</h3>
                    <p className="text-small text-grey-700 ">
                      Event Date: { ticket.eventDate
                        ? new Date( ticket.eventDate ).toLocaleDateString()
                        : "No date available" }
                    </p>
                  </CardHeader>
                  <Divider />
                  <CardBody className="flex flex-col items-center" >
                    <p className='text-grey-700text-center'>{ ticket.description }</p>
                    <p className="text-lg text-grey-700 font-semibold">
                      Price: ${ parseFloat( ticket.price ).toFixed( 2 ) }
                    </p>
                  </CardBody>
                  <Divider />
                  <CardFooter >
                    <TicketPurchaseClient
                      ticket={ ticket }
                      eventSlug={ eventSlug }

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

      {/* Slideshow Background */ }
      <ul className="slideshow">
        { bannerImages.map( ( image, index ) => (
          <li key={ index }>
            <span
              style={ { backgroundImage: `url(${ image })` } }
              className="absolute inset-0 w-full h-full bg-cover bg-center"
            ></span>
          </li>
        ) ) }
      </ul>
    </div>
  );
};

export default SlideShow;