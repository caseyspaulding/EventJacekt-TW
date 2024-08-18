import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/db';
import { events, orgTicketTypes } from '@/db/schema';
import { getEventIdBySlug } from '@/app/actions/getEventIdBySlug';
import { eq } from 'drizzle-orm/expressions';
import TicketPurchaseClient from './TicketPurchaseClient';

interface Params {
    eventSlug: string;
}

export default async function EventPage({ params }: { params: Params }) {
    const eventSlug = params.eventSlug;

    const eventId = await getEventIdBySlug(eventSlug);

    if (!eventId) {
        notFound();
    }

    const event = await db.select().from(events).where(eq(events.id, eventId)).limit(1);

    const eventData = event[0];

    if (!eventData) {
        notFound();
    }

    const tickets = await db
        .select({
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
            updatedAt: orgTicketTypes.updatedAt
        })
        .from(orgTicketTypes)
        .where(eq(orgTicketTypes.eventId, eventId));

    return (
        <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
            <h1 className="mb-4 text-3xl font-bold text-gray-900">{eventData.name}</h1>
            <p className="mb-2 text-lg text-gray-700">{eventData.description}</p>
            <p className="mb-2 text-sm text-gray-500">
                Start Date:{' '}
                {eventData.startDate
                    ? new Date(eventData.startDate).toLocaleDateString()
                    : 'No start date available'}
            </p>
            <p className="mb-2 text-sm text-gray-500">
                End Date:{' '}
                {eventData.endDate
                    ? new Date(eventData.endDate).toLocaleDateString()
                    : 'No end date available'}
            </p>
            <p className="mb-6 text-sm text-gray-500">Venue: {eventData.venue}</p>

            <h2 className="mb-4 text-2xl font-semibold text-gray-800">Available Tickets</h2>
            {tickets.length > 0 ? (
                <ul className="space-y-4">
                    {tickets.map((ticket) => (
                        <li
                            key={ticket.id}
                            className="rounded-md border border-gray-200 bg-gray-50 p-4"
                        >
                            <h3 className="text-xl font-medium text-gray-900">{ticket.name}</h3>
                            <p className="text-gray-700">{ticket.description}</p>
                            <p className="text-lg font-semibold text-gray-800">
                                Price: ${parseFloat(ticket.price).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">
                                Event Date:{' '}
                                {ticket.eventDate
                                    ? new Date(ticket.eventDate).toLocaleDateString()
                                    : 'No date available'}
                            </p>
                            <TicketPurchaseClient ticket={ticket} eventSlug={eventSlug} />
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-red-500">No tickets available for this event.</p>
            )}
        </div>
    );
}
