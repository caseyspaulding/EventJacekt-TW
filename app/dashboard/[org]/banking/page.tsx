import React from 'react';
import BankingPageClient from './BankingPageClient';
import { organizations } from '@/db/schema';
import { db } from '@/db';
import { eq } from 'drizzle-orm';

export default async function BankingPageWrapper({ params }: { params: { org: string } }) {
    const decodedOrgName = decodeURIComponent(params.org);

    try {
        // Fetch the stripe_connect_linked status and stripe_account_id from the database
        const [organization] = await db
            .select({
                stripeConnectLinked: organizations.stripeConnectLinked,
                stripeAccountId: organizations.stripeAccountId
            })
            .from(organizations)
            .where(eq(organizations.name, decodedOrgName));

        const isLinked = organization?.stripeConnectLinked ?? false;
        const stripeAccountId = organization?.stripeAccountId ?? null;

        return (
            <BankingPageClient
                isStripeConnected={isLinked}
                initialAccountId={stripeAccountId}
                params={params}
            />
        );
    } catch (error) {
        console.error('Error fetching organization data:', error);
        return <div>Error loading banking page. Please try again later.</div>;
    }
}
