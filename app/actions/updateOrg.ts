'use server';

import { db } from '@/db';
import { organizations } from '@/db/schema';
import { eq } from 'drizzle-orm/expressions';
import { revalidatePath } from 'next/cache';

// Update Stripe data for an organization
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateOrganizationStripeData = async (decodedOrgName: string, accountDetails: any) => {
    try {
        // Find the organization by its name
        const [existingOrg] = await db
            .select()
            .from(organizations)
            .where(eq(organizations.name, decodedOrgName));

        if (!existingOrg) {
            throw new Error(`Organization with name ${decodedOrgName} not found.`);
        }

        // Update the stripe_account_id
        await db
            .update(organizations)
            .set({ stripeAccountId: accountDetails.stripeConnectAccountId })
            .where(eq(organizations.id, existingOrg.id));

        // Update the stripe_connect_linked
        await db
            .update(organizations)
            .set({ stripeConnectLinked: accountDetails.stripeConnectLinked })
            .where(eq(organizations.id, existingOrg.id));

        // Update the stripe_account_created
        await db
            .update(organizations)
            .set({ stripeAccountCreated: accountDetails.stripeAccountCreated })
            .where(eq(organizations.id, existingOrg.id));

        // Update the updated_at field
        await db
            .update(organizations)
            .set({ updatedAt: new Date() })
            .where(eq(organizations.id, existingOrg.id));

        // Revalidate the organization path to refresh the page
        revalidatePath(`/dashboard/${existingOrg.id}`);

        return { success: true, message: 'Organization Stripe data updated successfully' };
    } catch (error) {
        console.error('Error updating organization Stripe data:', error);
        return { success: false, message: 'Error updating organization Stripe data' };
    }
};
