import React from "react";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { events, orgTicketTypes } from "@/db/schema";
import { getEventIdBySlug } from "@/app/actions/getEventIdBySlug";
import { eq } from "drizzle-orm/expressions";

import FooterFull from "@/components/Footers/FooterFull";
import EventImage from "@/components/EventHomeOne/Hero/EventImage";
import { absoluteUrl } from "@/lib/utils";
import type { Metadata } from "next/types";

import BuyTicketsComp from "@/components/EventHomeOne/Hero/BuyTicketsComp";

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

    const event = await db.select().from( events ).where( eq( events.id, eventId ) ).limit( 1 );
    const eventData = event[ 0 ];

    if ( !eventData )
    {
        return {
            title: 'Event Not Found',
            description: 'The requested event could not be found.',
        };
    }

    const title = `${ eventData.name } | EventJacket`;
    const description = eventData.description || `Join us for ${ eventData.name }`;
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
                    alt: eventData.name,
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

export default async function BuyTickets( { params }: { params: Params } )
{
    const eventSlug = params.eventSlug;
    const eventId = await getEventIdBySlug( eventSlug );

    if ( !eventId )
    {
        notFound();
    }

    const event = await db.select().from( events ).where( eq( events.id, eventId ) ).limit( 1 );
    const eventData = event[ 0 ];

    if ( !eventData )
    {
        notFound();
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
           
            <div>
              
          <EventImage
            imageUrl={ eventData.featuredImage || "/images/event-default.jpg" }
            alt="My amazing event"
            overlayColor="bg-blue-600"
          />
                
          <BuyTicketsComp eventName={ eventData.name }
            eventSubtitle={ eventData.description || "" }
            eventDate={ eventData.startDate ? new Date( eventData.startDate ).toLocaleDateString() : "" }
            location={ eventData.venue || "No venue available" }

            startDate={ eventData.startDate ? new Date( eventData.startDate ).toISOString() : "" }
            //buyTicketsLink={ `/events/${ eventSlug }/buy-tickets` }
            tickets={ tickets as [] }  // Ensure tickets are correctly typed
            eventSlug={ eventSlug }
          />
          
               
                <FooterFull />
            </div>
        </>
    );
}