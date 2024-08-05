'use server';

import { db } from '@/db';
import { organizations, userProfiles } from '@/db/schema';
import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';

export const signUp = async (formData: FormData) => {
    const origin = headers().get('origin');
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const orgName = formData.get('orgName') as string;
    const supabase = createClient();

    // Input validation
    if (!email || !password || !orgName) {
        return { success: false, message: 'All fields are required' };
    }

    try {
        // Step 1: Create user
        const { data: userResponse, error: userError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${origin}/auth/callback`
            }
        });

        if (userError || !userResponse.user) {
            console.error('User creation error:', userError);
            return { success: false, message: 'Could not create user' };
        }

        const userId = userResponse.user.id;

        // Use a transaction for organization and user profile creation
        await db.transaction(async (trx) => {
            // Step 2: Create organization
            const [org] = await trx
                .insert(organizations)
                .values({ name: orgName })
                .returning({ id: organizations.id })
                .onConflictDoNothing();

            if (!org) {
                throw new Error('Could not create organization');
            }

            // Step 3: Create user profile
            await trx.insert(userProfiles).values({
                userId: userId,
                orgId: org.id,
                organizationName: orgName
            });
        });

        console.log('Sign up process completed successfully.');
        return { success: true, redirectUrl: `${origin}/signup-success` };
    } catch (error) {
        console.error('Error during signup:', error);
        return { success: false, message: 'Could not complete sign up' };
    }
};
