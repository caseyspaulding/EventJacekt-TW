



import { startCase, toLower } from 'lodash';
import { Button } from '@nextui-org/button';
import { getEventIdBySlug } from '@/app/actions/getEventIdBySlug';
import { events, organizations, orgCustomers, orgTicketTypes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { notFound } from 'next/navigation';

import ConfettiComponent from '@/components/Confetti/Confetti';
import TicketDisplay from '@/components/TicketViewer';


export default async function SuccessPage ( { params }: { params: { eventSlug: string } } )
{
    const { eventSlug } = params;

    const eventId = await getEventIdBySlug( eventSlug );

    if ( !eventId )
    {
        notFound();
    }

    // Fetch event with organization details
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
            orgName: organizations.name,
        } )
        .from( events )
        .innerJoin( organizations, eq( events.orgId, organizations.id ) )
        .where( eq( events.id, eventId ) )
        .limit( 1 );

    const eventData = eventWithOrg[ 0 ];

    if ( !eventData )
    {
        notFound();
    }

    // Fetch tickets and customer details
    const ticketsWithCustomer = await db
        .select( {
            ticketId: orgTicketTypes.id,
            eventId: orgTicketTypes.eventId,
            orgId: orgTicketTypes.orgId,
            ticketName: orgTicketTypes.name,
            description: orgTicketTypes.description,
            price: orgTicketTypes.price,
            quantity: orgTicketTypes.quantity,
            eventDate: orgTicketTypes.eventDate,
            saleStartDate: orgTicketTypes.saleStartDate,
            saleEndDate: orgTicketTypes.saleEndDate,
            customerName: orgCustomers.name, // Get the customer's name
        } )
        .from( orgTicketTypes )
        .innerJoin( orgCustomers, eq( orgTicketTypes.orgId, orgCustomers.orgId ) )
        .where( eq( orgTicketTypes.eventId, eventId ) );

    if ( !ticketsWithCustomer.length )
    {
        notFound();
    }

    const ticket = ticketsWithCustomer[ 0 ]; // Use the first ticket type found

    const cleanedEventName = startCase( toLower( eventSlug.replace( /-/g, ' ' ) ) );
    const eventDate = ticket.eventDate;
    const eventLocation = `${ eventData.venue || '' }, ${ eventData.city || '' }, ${ eventData.state || '' } ${ eventData.zipCode || '' }, ${ eventData.country || '' }`;

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-blue-500">
            <ConfettiComponent />
            <div className="relative w-full max-w-lg m-2">
                <div className="absolute inset-0 rounded-2xl "></div>
                <div className="relative m-3 rounded-2xl bg-white p-8 text-center shadow-2xl">
                    <h1 className="mb-4 text-4xl font-extrabold text-green-500">Success!</h1>
                    <p className="mb-4 text-2xl">
                        Thank you for purchasing a ticket(s) to <span className="font-extrabold">{ cleanedEventName }</span>.
                    </p>

                    {/* Insert the client component to display the generated ticket */ }
                    <TicketDisplay
                        eventName={ eventData.eventName }
                        eventDate={ eventDate }
                        eventTime="7:00 PM" // Replace with actual event time
                        price={ ticket.price.toString() }
                        address={ eventLocation }
                        ticketNumber={ '' }
                        customerName={ ticket.customerName } // Pass the customer name
                    />

                    <p className="mb-4 text-lg">Your ticket(s) have been sent to the email address you provided during checkout.</p>
                    <div className="mb-4 text-left">
                        <h2 className="text-xl font-semibold mb-2">Event Details</h2>
                        <p><strong>Date:</strong> { eventDate }</p>
                        <p><strong>Location:</strong> { eventLocation }</p>
                        <p className="mt-2">Please bring your ticket (email or printed) to the event to be scanned at the door.</p>
                    </div>

                    <div className="flex justify-center space-x-4 mt-6">
                        <Button as="a" href={ `/events/${ eventSlug }` } className="text-white bg-orange-500">
                            View Event Details
                        </Button>
                        <Button href="/events" className="text-white bg-orange-500">
                            Explore More Events
                        </Button>
                    </div>

                    <div className="mt-4 text-sm text-gray-500">
                        <p>If you have any questions, please contact our support team at <a href="mailto:support@eventjacket.com" className="text-blue-600">support@eventjacket.com</a>.</p>
                    </div>

                    <div className="mt-6">
                        <p className="text-sm">We value your feedback! Please take a moment to <a href="/feedback" className="text-blue-600 underline">fill out our survey</a> to help us improve.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}