/* eslint-disable @typescript-eslint/no-unused-vars */
'use server';


import { stripe } from '@/utils/stripe';
import { redirect } from 'next/navigation';
import { fetchUserProfile } from '@/app/actions/fetchUserProfile';

import { getUserProfile } from '@/db/dataAccess/userProfiles';

//export async function updateStripeConnectStatus(userId: string) {
//    try {
//        const userProfile = await getUserProfile(userId);
//        if (!userProfile.stripeConnectedAccountId) {
//            throw new Error('User does not have a Stripe Connect account');
//        }

//        const account = await stripe.accounts.retrieve(userProfile.stripeConnectedAccountId);

//        await updateUserStripeConnect(userId, {
//            stripeConnectedAccountId: account.id,
//            stripeAccountType: account.type,
//            stripeAccountStatus: account.details_submitted ? 'active' : 'pending',

//            stripeConnectLinked: true
//        });

//        return { success: true, status: account.details_submitted ? 'active' : 'pending' };
//    } catch (error) {
//        console.error('Error updating Stripe Connect status:', error);
//        return { success: false, error: 'Failed to update Stripe Connect status' };
//    }
//}

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
    const user = fetchUserProfile();
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

//export async function CreateStripeAccountLink2() {
//    const user = await fetchUserProfile();

//    if (!user) {
//        throw new Error();
//    }

//    const accountLink = await stripe.accountLinks.create({
//        account: user.stripeCustomerId as string,
//        refresh_url:
//            process.env.NODE_ENV === 'development'
//                ? `http://localhost:3000/billing`
//                : `https://eventjacket.com/billing`,
//        return_url:
//            process.env.NODE_ENV === 'development'
//                ? `http://localhost:3000/return/${user?.stripeConnectedAccountId}`
//                : `https://eventjacket.com/return/${user?.stripeConnectedAccountId}`,
//        type: 'account_onboarding'
//    });

//    return redirect(accountLink.url);
//}
