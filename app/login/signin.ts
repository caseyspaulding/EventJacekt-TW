'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { userProfiles, organizations } from '@/db/schema';
import { eq } from 'drizzle-orm/expressions';

export async function signIn(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const supabase = createClient();

    const {
        data: { user },
        error
    } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        return redirect('/login?message=Could not authenticate user');
    }

    if (!user) {
        return redirect('/login?message=User not found');
    }

    try {
        // Fetch user profile data along with organization name
        const userProfilesResult = await db
            .select({
                id: userProfiles.id,
                organizationId: userProfiles.orgId,
                organizationName: organizations.name
            })
            .from(userProfiles)
            .innerJoin(organizations, eq(userProfiles.orgId, organizations.id))
            .where(eq(userProfiles.userId, user.id))
            .limit(1);

        if (userProfilesResult.length === 0) {
            return redirect('/login?message=User profile not found');
        }

        const userProfile = userProfilesResult[0];
        const dashboardUrl = `/dashboard/${encodeURIComponent(userProfile.organizationName)}`;
        return redirect(dashboardUrl);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return redirect('/login?message=Error fetching user profile');
    }
}
