'use server';

import { db } from '../../../db';
import { events, organizations } from '@/db/schema';
import { createClient } from '@/utils/supabase/server';
import { and, eq } from 'drizzle-orm/expressions';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

// Utility function to get user and organization ID
export const getUserAndOrgId = async () =>
{
    const supabase = createClient();
    const {
        data: { user },
        error: userError
    } = await supabase.auth.getUser();

    if ( userError || !user )
    {
        throw new Error( 'Not authenticated' );
    }

    const { data: profile, error: profileError } = await supabase
        .from( 'user_profiles' )
        .select( 'org_id' )
        .eq( 'user_id', user.id )
        .single();

    if ( profileError || !profile )
    {
        throw new Error( 'No organization found' );
    }

    return { user, orgId: profile.org_id };
};

// Fetch events for the current organization
export const fetchEventsForOrg = async () =>
{
    const { orgId } = await getUserAndOrgId();

    const eventsData = await db.select().from( events ).where( eq( events.orgId, orgId ) );

    return eventsData;
};

