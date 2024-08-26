import React from "react";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { events, orgTicketTypes } from "@/db/schema";
import { getEventIdBySlug } from "@/app/actions/getEventIdBySlug";
import { eq } from "drizzle-orm/expressions";
import MainBanner from "@/components/EventHomeOne/Hero/MainBanner";

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
        <div>
            <MainBanner
                eventName={ eventData.name }
                eventSubtitle={ eventData.description || "" }
                eventDate={ eventData.startDate ? new Date( eventData.startDate ).toLocaleDateString() : "" }
                location={ eventData.venue || "No venue available" }
                bannerImages={ [
                    "/images/slideshow-bg1.jpg",
                    "/images/slideshow-bg2.jpg",
                    "/images/slideshow-bg3.jpg",
                    "/images/slideshow-bg4.jpg",
                ] }
                startDate={ eventData.startDate ? new Date( eventData.startDate ).toISOString() : "" }
                buyTicketsLink={ `/events/${ eventSlug }/buy-tickets` }
                tickets={ tickets as [] }  // Ensure tickets are correctly typed
                eventSlug={ eventSlug }
            />
        </div>
    );
}