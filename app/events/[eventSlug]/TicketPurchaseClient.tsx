'use client';

import { useState } from 'react';
import getStripe from '@/utils/stripeClient';
import { Button, Input } from '@nextui-org/react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default function TicketPurchaseClient({ ticket, eventSlug }) {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    const handleBuyTicket = async () => {
        setLoading(true);
        setErrorMessage(null); // Reset error message

        if (!firstName || !lastName || !email) {
            setErrorMessage('Please fill in all the required fields.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/stripe/createCheckoutSession', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ticket,
                    eventSlug,
                    buyer: { firstName, lastName, email }
                })
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle the error from the server
                setErrorMessage(data.error || 'An error occurred while processing your request.');
                return;
            }

            const stripe = await getStripe();

            if (stripe) {
                const { error } = await stripe.redirectToCheckout({ sessionId: data.id });

                if (error) {
                    console.error('Stripe Checkout error:', error);
                    setErrorMessage('An error occurred during checkout. Please try again.');
                }
            }
        } catch (error) {
            console.error('Failed to create checkout session:', error);
            setErrorMessage('Failed to create checkout session. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {errorMessage && <div className="mb-4 text-red-600 font-bold">{errorMessage}</div>}
            <Input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full "
                required
            />
            <Input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full"
                required
            />
            <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full "
                required
            />
            <Button
                onClick={handleBuyTicket}
                disabled={ loading }
               
                className="w-full rounded-md bg-orange-600 px-4 py-2 font-semibold text-white hover:bg-orange-500"
            >
                {loading ? 'Processing...' : 'Buy Ticket'}
            </Button>
        </div>
    );
}
