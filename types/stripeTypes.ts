import { organizations } from '@/db/schema';

export type StripeDataUpdates = {
    stripeConnectAccountId?: string;
    stripeConnectLinked?: boolean;
    stripeAccountCreated?: Date;

    // Add other Stripe-related fields here if needed
};
