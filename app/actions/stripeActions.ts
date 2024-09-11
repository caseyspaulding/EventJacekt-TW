/* eslint-disable @typescript-eslint/no-unused-vars */
'use server';

import { redirect } from 'next/navigation';
import { fetchUserProfile } from '@/app/actions/fetchUserProfile';
import {eq } from 'drizzle-orm/expressions';
import { organizations } from '@/db/schema';
import { db } from '@/db';
import { stripe } from '@/utils/stripe';


export async function initiateStripeConnect(userId: string) {
    try {
        const account = await stripe.accounts.create({
            type: 'express',
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true }
            }
        });

        const accountLinks = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL}/stripe/reauth`,
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/stripe/return`,
            type: 'account_onboarding'
        });

        // Update user profile with Stripe Connect information
       
        return { success: true, url: accountLinks.url };
    } catch (error) {
        console.error('Error creating Stripe Connect account:', error);
        return { success: false, error: 'Failed to create Stripe Connect account' };
    }
}

export async function CreateStripeAccountLink() {
 
    try {
        const account = await stripe.accounts.create({
            type: 'express',
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true }
            }
        });

        const accountLinks = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL}/stripe/reauth`,
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/stripe/return`,
            type: 'account_onboarding'
        });

        // Update user profile with Stripe account ID
        //await updateUserProfile( userId, { stripeConnectedAccountId: account.id } );

        // Redirect to Stripe's onboarding page
        redirect(accountLinks.url);
    } catch (error) {
        console.error('Error creating Stripe Connect account:', error);
        throw new Error('Failed to create Stripe Connect account');
    }
}

export async function createStripeAccountLink(account: string, org: string, origin: string) {
    try {
        // Validate the input parameters
        if (!account || !org || !origin) {
            console.error('Missing required parameters:', { account, org, origin });
            throw new Error('Missing required parameters');
        }

        // Construct the URLs using the `origin`, `org`, and `account` parameters
        const refreshUrl = `${origin}/dashboard/${org}/banking/refresh/${account}`;
        const returnUrl = `${origin}/dashboard/${org}/banking/return/${account}`;

        // Log the constructed URLs for debugging
        console.log('Constructed refresh URL:', refreshUrl);
        console.log('Constructed return URL:', returnUrl);

        // Attempt to create the Stripe account link
        const accountLink = await stripe.accountLinks.create({
            account: account,
            refresh_url: refreshUrl,
            return_url: returnUrl,
            type: 'account_onboarding'
        });

        // Log success and return the account link URL
        console.log('Stripe account link created successfully:', accountLink.url);
        return accountLink.url;
    } catch (error) {
        // Log any unexpected errors that occur during processing
        console.error(
            'An error occurred when calling the Stripe API to create an account link:',
            error
        );
        throw error; // Re-throw the error to be handled by the calling component
    }
}


/**
 * Fetches the Stripe client secret for the authenticated user's organization.
 * @returns The Stripe client secret.
 * @throws An error if authentication fails or the organization/Stripe account is invalid.
 */
export async function fetchStripeClientSecret (): Promise<string>
{
    try
    {
        const userProfile = await fetchUserProfile(); // Ensure async fetch

        if ( !userProfile || !userProfile.orgName )
        {
            console.warn( 'Server Action: User not authenticated or orgName missing.' );
            throw new Error( 'Unauthorized' );
        }

        const { orgName, id: userId } = userProfile; // Extract orgName and userId
        console.log( `Server Action: Fetching Stripe client secret for orgName: ${ orgName } and userId: ${ userId }` );

        // Fetch the Stripe account ID from the organizations table using orgName
        const organization = await db
            .select( { stripeAccountId: organizations.stripeAccountId } )
            .from( organizations )
            .where( eq( organizations.name, orgName ) ) // Query by orgName
            .limit( 1 );

        const stripeAccountId = organization[ 0 ]?.stripeAccountId;

        if ( !stripeAccountId )
        {
            console.error( `Server Action: Stripe account not found for organization: ${ orgName }` );
            throw new Error( 'Stripe account not found for this organization' );
        }

        // Always create a new session to avoid reuse issues
        const accountSession = await stripe.accountSessions.create( {
            account: stripeAccountId,
            components: {
                payments: {
                    enabled: true,
                    features: {
                        refund_management: true,
                        dispute_management: true,
                        capture_payments: true,
                    },
                },
                payouts: {
                    enabled: true, // Enable payouts if needed
                    features: {
                        instant_payouts: true, // Example feature
                    },
                },
                tax_settings: {
                    enabled: true, // Enable tax settings if needed
                },
            },
        } );

        console.log( 'Server Action: Stripe account session created:', accountSession );

        return accountSession.client_secret;
    } catch ( error: any )
    {
        console.error( 'Server Action: Error fetching Stripe client secret:', error.message );
        throw error;
    }
}
