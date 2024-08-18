import { stripe } from '@/utils/stripe';

// Define the type for ticketType for better type safety
interface TicketType {
    id: string;
    name: string;
    eventName: string;
    price: number; // Price should be in dollars, convert to cents if necessary
    description?: string;
    // Add other fields as necessary
}

async function createCheckoutSession(
    orgStripeAccountId: any,
    ticketType: { price: number; name: any; eventName: any },
    eventSlug: any
) {
    try {
        // Convert the price to cents if it's not already in cents
        const unitAmount = Math.round(ticketType.price * 100);

        // Create the Checkout Session
        const session = await stripe.checkout.sessions.create(
            {
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: ticketType.name,
                                description: `Ticket for ${ticketType.eventName}`
                            },
                            unit_amount: unitAmount // Ensure the price is in cents
                        },
                        quantity: 1
                    }
                ],
                payment_intent_data: {
                    application_fee_amount: 50 // Application fee in cents ($0.50)
                },
                mode: 'payment',
                success_url: `https://eventjacket.com/events/${eventSlug}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `https://eventjacket.com/events/${eventSlug}/cancel`
            },
            {
                stripeAccount: orgStripeAccountId // Connected account ID
            }
        );

        // Redirect customer to the session URL
        return session;
    } catch (error) {
        console.error('Error creating Stripe Checkout session:', error);
        throw error;
    }
}
