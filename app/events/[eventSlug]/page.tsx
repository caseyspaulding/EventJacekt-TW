import React from "react";
import { notFound } from "next/navigation";
import { db } from "@/db";

import { getEventIdBySlug } from "@/app/actions/getEventIdBySlug";
import { eq } from "drizzle-orm/expressions";
import { JsonLd } from 'react-schemaorg';
import type { Event as SchemaEvent } from 'schema-dts'
import { events, orgTicketTypes, organizations } from "@/db/schema";
import BuyTicketsComp from "@/components/EventHomeOne/Hero/BuyTicketsComp";
import NavBar1 from "@/components/NavBarTW/NavBar1";
import { absoluteUrl } from "@/lib/utils";
import type { Metadata } from "next";
import EventImage from "@/components/EventHomeOne/Hero/EventImage";

export async function generateMetadata (
    { params }: { params: Params }
): Promise<Metadata>
{
    const eventSlug = params.eventSlug;
    const eventId = await getEventIdBySlug( eventSlug );

    if ( !eventId )
    {
        return {
            title: 'Event Not Found',
            description: 'The requested event could not be found.',
        };
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

    const title = `${ eventData.eventName } | EventJacket`;
    const description = eventData.description || `Join us for ${ eventData.eventName }`;
    const imageUrl = absoluteUrl( eventData.featuredImage || '/images/event-default.jpg' );

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
            url: absoluteUrl( `/events/${ eventSlug }` ),
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: eventData.eventName,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ imageUrl ],
        },
    };
}
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
            
            <main className="pb-16 lg:pb-24 bg-white dark:bg-gray-900 antialiased">
                {/* Header */ }
                
                <header
                    className="w-full h-[460px] xl:h-[537px] bg-no-repeat bg-cover bg-center bg-blend-darken relative"
                    style={ { backgroundImage: `url('${ eventData.featuredImage }')` } }
                >
                    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>
                    <div className="absolute top-20 left-1/2 px-4 mx-auto w-full max-w-screen-xl -translate-x-1/2 xl:top-1/2 xl:-translate-y-1/2 xl:px-0">
                        <span className="block mb-4 text-gray-300">
                            
                            <h1 className="font-extrabold  text-5xl  text-white hover:underline">
                                { eventData.eventName}
                            </h1>
                        </span>
                        <h2 className="mb-4 max-w-4xl text-xl font-semiboldleading-none text-white sm:text-3xl lg:text-4xl">
                            { eventData.description }
                        </h2>
                        <p className="text-lg font-normal text-gray-300">
                            Location: { eventData.venue || "No venue available" }
                        </p>
                        <p className="text-lg font-normal text-gray-300">
                            Date: { eventData.startDate ? new Date( eventData.startDate ).toLocaleDateString() : ""  }
                        </p>
                    </div>
                </header>

                {/* Main Content */ }
                <div className="flex relative z-20 justify-between p-6 -m-36 mx-4 max-w-screen-xl bg-white dark:bg-gray-800 rounded xl:-m-32 xl:p-9 xl:mx-auto">
                    <article className="xl:w-[828px] w-full max-w-none format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
                        <div className="flex flex-col lg:flex-row justify-between lg:items-center">
                            <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400 text-base mb-2 lg:mb-0">
                                <span>
                                    Event By{ " " }
                                    <a href="#" className="text-gray-900 dark:text-white hover:underline no-underline font-semibold">
                                        { eventData.orgName }
                                    </a>
                                </span>
                                <span className="bg-gray-300 dark:bg-gray-400 w-2 h-2 rounded-full"></span>
                                <span>
                                    <time className="font-normal text-gray-500 dark:text-gray-400" dateTime={ eventData.startDate ? new Date( eventData.startDate ).toLocaleDateString() : "" }>
                                        { eventData.startDate ? new Date( eventData.startDate ).toLocaleDateString() : "" }
                                    </time>
                                </span>
                            </div>
                            {/* Social Media Share */ }
                            <aside aria-label="Share social media">
                                <div className="not-format">
                                    {/* Add social media share buttons here */ }
                                </div>
                            </aside>
                        </div>
                        {/* Article Content */ }
                        <p className="lead">Event description: { eventData.description }</p>
                        <p>Tickets available: { tickets.length }</p>
                        
                        <h4 className='mt-6'>Table example</h4>
                        <EventImage
                            imageUrl={ eventData.featuredImage || '' }
                            alt={ `${ eventData.eventName } image` }
                            overlayColor=""
                            height="h-[260px] xl:h-[437px]"
                        >
                            
                        </EventImage>
                    </article>
                    

                    {/* Sidebar */ }
                    <aside className="hidden xl:block" aria-labelledby="sidebar-label">
                        <div className="xl:w-[336px] sticky top-6">
                            <h3 id="sidebar-label" className="sr-only">Sidebar</h3>
                            {/* Buy Tickets Card */ }
                            <BuyTicketsComp
                                eventName={ eventData.eventName }
                                eventSubtitle={ eventData.description || "" }
                                eventDate={ eventData.startDate ? new Date( eventData.startDate ).toLocaleDateString() : "" }
                                location={ eventData.venue || "" }
                              
                                startDate={ eventData.startDate ? new Date( eventData.startDate ).toLocaleDateString() : "" }
                                tickets={ tickets as [] }
                                eventSlug={ eventSlug } />
                           
                            {/* Sidebar content */ }
                        </div>
                    </aside>
                </div>
            </main>
        </>
    );
}