import React from "react";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { getEventIdBySlug } from "@/app/actions/getEventIdBySlug";
import { eq } from "drizzle-orm/expressions";
import { JsonLd } from 'react-schemaorg';
import type { Event as SchemaEvent } from 'schema-dts'
import { events, orgTicketTypes, organizations } from "@/db/schema";
import NavBar1 from "@/components/NavBarTW/NavBar1";
import { absoluteUrl } from "@/lib/utils";

import EventImage from "@/components/EventHomeOne/Hero/EventImage";
import Countdown from "@/components/Countdown/Countdown";
import BuyTicketsButton from "@/components/EventHomeOne/BuyTicketsButton";
import StickyFooterBuyTickets from "@/components/EventHomeOne/StickeyFooterBuyTickets";
import EventDetails from "@/components/EventHomeOne/EventDetails";
import FooterFull from "@/components/Footers/FooterFull";
import '@/styles/gradientHeader.css'





interface Params
{
    eventSlug: string;
}

export default async function EventPage ( { params }: { params: Params } )
{
    const eventSlug = params.eventSlug;
    const eventId = await getEventIdBySlug( eventSlug );

    if ( !eventId )
    {
        notFound();
    }

    const eventWithOrg = await db
        .select( {
            eventId: events.id,
            eventName: events.name,
            description: events.description,
            startDate: events.startDate,
            endDate: events.endDate,
            featuredImage: events.featuredImage,
            venue: events.venue,
            city: events.city,
            state: events.state,
            zipCode: events.zipCode,
            country: events.country,
            orgId: events.orgId,
            orgName: organizations.name, // Fetch org name
        } )
        .from( events )
        .innerJoin( organizations, eq( events.orgId, organizations.id ) ) // Perform a join on orgId
        .where( eq( events.id, eventId ) )
        .limit( 1 );

    const eventData = eventWithOrg[ 0 ];

    if ( !eventData )
    {
        return {
            title: 'Event Not Found',
            description: 'The requested event could not be found.',
        };
    }

    const tickets = await db
        .select( {
            id: orgTicketTypes.id,
            eventId: orgTicketTypes.eventId,
            orgId: orgTicketTypes.orgId,
            name: orgTicketTypes.name,
            description: orgTicketTypes.description,
            price: orgTicketTypes.price,
            quantity: orgTicketTypes.quantity,
            eventDate: orgTicketTypes.eventDate,
            saleStartDate: orgTicketTypes.saleStartDate,
            saleEndDate: orgTicketTypes.saleEndDate,
            isEarlyBird: orgTicketTypes.isEarlyBird,
            maxPerCustomer: orgTicketTypes.maxPerCustomer,
            isFree: orgTicketTypes.isFree,
            category: orgTicketTypes.category,
            promoCodeRequired: orgTicketTypes.promoCodeRequired,
            availableOnline: orgTicketTypes.availableOnline,
            groupDiscountAvailable: orgTicketTypes.groupDiscountAvailable,
            refundable: orgTicketTypes.refundable,
            currency: orgTicketTypes.currency,
            salesLimitPerDay: orgTicketTypes.salesLimitPerDay,
            createdAt: orgTicketTypes.createdAt,
            updatedAt: orgTicketTypes.updatedAt,
        } )
        .from( orgTicketTypes )
        .where( eq( orgTicketTypes.eventId, eventId ) );

    const ticketType = await db
        .select( {
            id: orgTicketTypes.id,
            eventId: orgTicketTypes.eventId,
            orgId: orgTicketTypes.orgId,
            name: orgTicketTypes.name,
            description: orgTicketTypes.description,
            price: orgTicketTypes.price,
            quantity: orgTicketTypes.quantity,
            eventDate: orgTicketTypes.eventDate,
            saleStartDate: orgTicketTypes.saleStartDate,
            saleEndDate: orgTicketTypes.saleEndDate,
            isEarlyBird: orgTicketTypes.isEarlyBird,
            maxPerCustomer: orgTicketTypes.maxPerCustomer,
            isFree: orgTicketTypes.isFree,
            category: orgTicketTypes.category,
            promoCodeRequired: orgTicketTypes.promoCodeRequired,
            availableOnline: orgTicketTypes.availableOnline,
            groupDiscountAvailable: orgTicketTypes.groupDiscountAvailable,
            refundable: orgTicketTypes.refundable,
            currency: orgTicketTypes.currency,
            salesLimitPerDay: orgTicketTypes.salesLimitPerDay,
            createdAt: orgTicketTypes.createdAt,
            updatedAt: orgTicketTypes.updatedAt,
        } )
        .from( orgTicketTypes )
        .where( eq( orgTicketTypes.eventId, eventId ) )
        .limit( 1 ); // Assuming you want the first ticket type found

    if ( !ticketType.length )
    {
        notFound();
    }

    const ticket = ticketType[ 0 ]; // Use the first ticket type found


    return (
        <>
            <JsonLd<SchemaEvent>
                item={ {
                    "@context": "https://schema.org",
                    "@type": "Event",
                    name: eventData.eventName,
                    description: eventData.description || "No description available",
                    startDate: eventData.startDate ? new Date( eventData.startDate ).toLocaleDateString() : "",
                    endDate: eventData.endDate ? new Date( eventData.endDate ).toLocaleDateString() : "",
                    location: {
                        "@type": "Place",
                        name: eventData.venue || "No venue available",
                        address: {
                            "@type": "PostalAddress",
                            addressLocality: eventData.city || "No city available",
                            addressRegion: eventData.state || "No state available",
                            postalCode: eventData.zipCode || "No zip code available",
                            addressCountry: eventData.country || "No country available",
                        },
                    },
                    image: [
                        absoluteUrl( eventData.featuredImage || '/images/event-default.jpg' ),
                    ],
                    offers: tickets.map( ticket => ( {
                        "@type": "Offer",
                        price: ticket.price || "0.00",
                        priceCurrency: ticket.currency || "USD",
                        availability: ticket.quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
                        url: absoluteUrl( `/events/${ eventSlug }` ),
                    } ) ),
                } }
            />
            <NavBar1 />

            <main className="">
               <div className="mt-52 absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
           
                <header className="w-full h-[170px] xl:h-[150px] relative overflow-hidden gradient-bg">
                    {/* Gradient Overlay */ }
                    {/*<div className="absolute inset-0 bg-blue-600 bg-opacity-30"></div>*/}

                
                    <div className="relative z-10 text-center p-4">
                        {/* Your header content goes here */ }
                    </div>
                </header>
         
                {/* Main Content */ }
                <div className="flex relative z-20 justify-between shadow-2xl p-3 -m-36 mx-4 max-w-screen-xl bg-white dark:bg-gray-800 rounded-xl xl:-m-32 xl:p-9 xl:mx-auto">
                    <article className="xl:w-[828px] w-full max-w-none format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
                        <div className="flex flex-col lg:flex-row justify-between lg:items-center ">
                            <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400 text-base lg:mb-0">


                            </div>
                            {/* Social Media Share */ }
                            <aside aria-label="Share social media">
                                <div className="not-format">
                                  {/* Add social media share buttons here */ }
                                </div>
                            </aside>
                        </div>
                        {/* Article Content */ }
                       



                        <EventImage
                            imageUrl={ eventData.featuredImage || '' }
                            alt={ `${ eventData.eventName } image` }
                            overlayColor=""
                            height="h-[260px] xl:h-[437px]"
                        >
                        </EventImage>
                        <div className="mt-8">
                            <span className="">
                               
                                { eventData.startDate && eventData.endDate ? (
                                    <>
                                        { new Date( eventData.startDate ).toDateString() } - { new Date( eventData.endDate ).toDateString() }
                                    </>
                                ) : eventData.startDate ? (
                                        new Date( eventData.startDate ).toDateString()
                                ) : eventData.endDate ? (
                                            new Date( eventData.endDate ).toDateString()
                                ) : (
                                    "No dates available"
                                ) }
                               
                                 
                              
                            </span>
                        </div>
                        <span className="block mb-2 text-gray-800">
                            <h1 className="font-extrabold text-5xl lg:text-6xl ">
                                { eventData.eventName }
                            </h1>
                        </span>
                        <h2 className="mb-4 max-w-4xl text-xl leading-none text-gray-900  sm:text-xl lg:text-xl">
                            { eventData.description }
                        </h2>
                        <div className="my-2 ">
                            <Countdown
                                startDate={ ticket.eventDate ? ticket.eventDate.toString() : "" }
                                color="text-gray-700" // Text color for numbers
                                labelColor="text-gray-500" // Text color for labels
                            />
                        </div>


                        <EventDetails
                            date={
                                eventData.startDate && eventData.endDate ? (
                                    <>
                                        { new Date( eventData.startDate ).toLocaleDateString() } - { new Date( eventData.endDate ).toLocaleDateString() }
                                    </>
                                ) : eventData.startDate ? (
                                    new Date( eventData.startDate ).toLocaleDateString()
                                ) : eventData.endDate ? (
                                    new Date( eventData.endDate ).toLocaleDateString()
                                ) : (
                                    "No dates available"
                                )
                            }
                            time={ "" }
                            timezone={ "" }
                            locationName={ eventData.venue }
                            locationAddress={ "" }
                            refundPolicy={ '' }
                            about={ eventData.description }
                            />


                    </article>


                    {/* Sidebar */ }
                    <aside className="hidden xl:block" aria-labelledby="sidebar-label">
                        <div className="xl:w-[336px] sticky top-20">
                            <h3 id="sidebar-label" className="sr-only">Sidebar</h3>
                            {/* Buy Tickets Card */ }

                            <BuyTicketsButton eventSlug={ eventSlug } priceRange={ ticket.price } />

                            {/* Sidebar content */ }
                        </div>
                    </aside>
                </div>
                <div className='lg:mt-8 pt-5 mt-20 '>
                    <FooterFull />
                </div>

            </main>
            <StickyFooterBuyTickets eventSlug={ eventSlug } priceRange={ ticket.price } />
        </>
    );
}
