import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { stripe } from '@/utils/stripe';
import { db } from '@/db';
import { orgEventTickets, orgCustomers, orgTicketTypes, events } from '@/db/schema';
import { getOrgIdFromTicketType, getStripeAccountIdFromOrgId } from '@/app/actions/ticketActions';

import { eq } from 'drizzle-orm';
import { sendTicketEmail } from '@/helpers/generateQRCodeURL';

type Customer = {
    id: string;
    orgId: string;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    zipCode: string | null;
    profileImageUrl: string | null;
    status: string | null; // Adjusted to allow for null values
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata: any;
    notes: string | null;
    favoriteEventId: string | null;
    favoritePerformerId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { ticket, eventSlug, buyer } = body;

        console.log('Received ticket data:', ticket);
        console.log('Received buyer data:', buyer);

        // Step 1: Get the organization ID by ticket type
        const orgId = await getOrgIdFromTicketType(ticket.id);

        console.log('Fetched orgId:', orgId);

        if (!orgId) {
            throw new Error('Organization ID not found.');
        }

        // Perform a join to fetch event name and description from orgTicketTypes and events tables
        const [ticketTypeData] = await db
            .select({
                eventName: events.name,
                description: orgTicketTypes.description
            })
            .from(orgTicketTypes)
            .innerJoin(events, eq(orgTicketTypes.eventId, events.id))
            .where(eq(orgTicketTypes.id, ticket.id))
            .execute();

        if (!ticketTypeData) {
            throw new Error('Event or ticket type not found.');
        }

        // Step 2: Check if the customer already exists
        const customers: Customer[] = await db
            .select()
            .from(orgCustomers)
            .where(eq(orgCustomers.email, buyer.email))
            .execute();

        let customer = customers[0]; // Assuming there's at most one customer with a given email

        if (!customer) {
            // Step 3: Insert the new customer if they do not exist
            await db.insert(orgCustomers).values({
                orgId: orgId,
                name: `${buyer.firstName} ${buyer.lastName}`,
                email: buyer.email,
                phone: buyer.phone || null, // Add additional fields as necessary
                address: buyer.address || null,
                city: buyer.city || null,
                state: buyer.state || null,
                country: buyer.country || null,
                zipCode: buyer.zipCode || null,
                profileImageUrl: buyer.profileImageUrl || null,
                status: 'active',
                metadata: buyer.metadata || null,
                notes: buyer.notes || null,
                favoriteEventId: null, // Or set this dynamically if needed
                favoritePerformerId: null, // Or set this dynamically if needed
                createdAt: new Date(),
                updatedAt: new Date()
            });

            // Fetch the customer again after insertion to get the new ID
            const insertedCustomers: Customer[] = await db
                .select()
                .from(orgCustomers)
                .where(eq(orgCustomers.email, buyer.email))
                .execute();

            customer = insertedCustomers[0];
        }

        // At this point, customer should be defined with an ID
        const customerId = customer.id;

        const orgStripeAccountId = await getStripeAccountIdFromOrgId(orgId);

        if (!orgStripeAccountId) {
            // If the Stripe account ID is null, send an error response back to the UI
            return NextResponse.json(
                { error: 'Stripe account is not set up for this organization.' },
                { status: 400 }
            );
        }

        console.log('Fetched Stripe account ID:', orgStripeAccountId);

        const unitAmount = Math.round(ticket.price * 100);

        // Step 4: Create the Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: ticket.name,
                            description: `Ticket for ${ticketTypeData.eventName}` // Use the event name fetched via join
                        },
                        unit_amount: unitAmount
                    },
                    quantity: 1
                }
            ],
            payment_intent_data: {
                application_fee_amount: 50,
                transfer_data: {
                    destination: orgStripeAccountId
                }
            },
            customer_email: buyer.email, // Automatically send receipt to buyer's email
            mode: 'payment',
            success_url: `https://eventjacket.com/events/${eventSlug}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `https://eventjacket.com/events/${eventSlug}/cancel`
        });

        // Step 5: Save the ticket purchase details directly to the database
        const ticketData = {
            eventId: ticket.eventId,
            orgId: orgId,
            customerId: customerId, // Use the fetched customer ID
            ticketTypeId: ticket.id,
            name: ticket.name,
            price: ticket.price,
            currency: 'USD',
            status: 'sold', // Directly setting the status
            eventName: ticketTypeData.eventName, // Event name from join
            description: ticketTypeData.description, // Description from join
            validFrom: ticket.validFrom,
            validUntil: ticket.validUntil,
            purchaseDate: new Date(),
            stripeSessionId: session.id,
            createdAt: new Date(),
            updatedAt: new Date()
            // Add any additional fields as required
        };

        // Insert the ticket and return the full row including the id
        
        const [ insertedTicket ] = await db.insert( orgEventTickets )
            .values( ticketData )
            .returning( {
                id: orgEventTickets.id,
                name: orgEventTickets.name,
                price: orgEventTickets.price,
                status: orgEventTickets.status,
                eventId: orgEventTickets.eventId,
                orgId: orgEventTickets.orgId,
                customerId: orgEventTickets.customerId,
                ticketTypeId: orgEventTickets.ticketTypeId,
               
               
                purchaseDate: orgEventTickets.purchaseDate,
                stripeSessionId: orgEventTickets.stripeSessionId,
                createdAt: orgEventTickets.createdAt,
                updatedAt: orgEventTickets.updatedAt
            } )
            .execute(); 
       

       // await db.insert( orgEventTickets ).values( ticketData );
        
        // Step 6: Send the ticket email with QR code
        await sendTicketEmail(
            buyer,
            insertedTicket, // Pass the inserted ticket with the id
            ticketTypeData.eventName,
            ticketTypeData.description || 'No description available' );
        return NextResponse.json(session);
    } catch (error) {
        console.error('Error creating Stripe Checkout session:', error);
        return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
    }
}
