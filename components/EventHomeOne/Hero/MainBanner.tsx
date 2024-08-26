"use client";

import React from "react";

import Countdown from "./Countdown";

// Global Styles
import "@/styles/style.css";
import "@/styles/responsive.css";
import "@/styles/animate.min.css";
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
  buyTicketsLink: string;
  tickets: Ticket[];
  eventSlug: string;
}

const MainBanner: React.FC<MainBannerProps> = ( {
  eventName,
  eventSubtitle,
  eventDate,
  location,
  bannerImages,
  startDate,
  //buyTicketsLink,
  tickets,
  eventSlug,
} ) =>
{
  return (
    <div className="main-banner slideshow-banner py-24">
      {/* Overlay */ }
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

      {/* Two-column Layout */ }
      <div className="relative z-10 max-w-screen-xl mx-auto lg:grid lg:grid-cols-[3fr_1fr] lg:gap-8">
        {/* Left Column: Event Information */ }
        <div className="flex flex-col items-center justify-center p-6  bg-opacity-70 backdrop-filter backdrop-blur-sm rounded-md">
          <div className="main-banner-content ">
            <Countdown startDate={ startDate } />

            <h1 className="text-5xl font-bold text-white mb-4">
              { eventName } <br /> <span className="text-xl sm:text-2xl md:text-3xl">{ eventSubtitle }</span>

            </h1>

            <ul className="mb-6">
              <li className="text-white text-lg">
                <i className="icofont-compass mr-2"></i> { location }
              </li>
              <li className="text-white text-lg">
                <i className="icofont-calendar mr-2"></i> { eventDate }
              </li>
            </ul>

            <div className="button-box">
              {/*<Link href={ buyTicketsLink }>
                <button className="bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition shadow-lg">
                  Buy Tickets Now!
                </button>
              </Link>*/}
            </div>
          </div>
        </div>

        {/* Right Column: Tickets Card */ }
        <div className="p-6">
          <h2 className="mb-2 text-2xl text-center font-semibold text-white">
            Available Tickets
          </h2>
          { tickets.length > 0 ? (
            <ul className="space-y-4">
              { tickets.map( ( ticket ) => (
                <li
                  key={ ticket.id }
                  className="rounded-2xl border border-blue-400 p-3"
                >
                  <h3 className="text-xl font-medium text-white">
                    { ticket.name }
                  </h3>
                  <p className="text-white">{ ticket.description }</p>
                  <p className="text-lg font-semibold text-white">
                    Price: ${ parseFloat( ticket.price ).toFixed( 2 ) }
                  </p>
                  <p className="text-sm text-white">
                    Event Date:{ " " }
                    { ticket.eventDate
                      ? new Date( ticket.eventDate ).toLocaleDateString()
                      : "No date available" }
                  </p>
                  <TicketPurchaseClient ticket={ ticket } eventSlug={ eventSlug } />
                </li>
              ) ) }
            </ul>
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

export default MainBanner;
