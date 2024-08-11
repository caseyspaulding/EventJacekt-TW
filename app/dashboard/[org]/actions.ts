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

// Create a new event
export const createEvent = async ( formData: FormData ) =>
{
    const { orgId } = await getUserAndOrgId();
    const name = formData.get( 'name' ) as string;
    const description = formData.get( 'description' ) as string;
    const startDate = new Date( formData.get( 'startDate' ) as string );
    const endDate = new Date( formData.get( 'endDate' ) as string );
    const venue = formData.get( 'venue' ) as string;
    const slug = name.toLowerCase().replace( /\s+/g, '-' ); // Example slug generation

    const newEvent = {
        id: uuidv4(),
        orgId,
        organizationName: '', // Fetch this dynamically if necessary
        name,
        slug,
        startDate,
        endDate,
        venue,
        status: 'draft', // Default status, adjust as needed
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    await db.insert( events ).values( newEvent );

    // Revalidate the path to refresh the page
    revalidatePath( `/dashboard/${ orgId }` );

    return newEvent;
};

// Update an existing event
export const updateEvent = async ( eventId: string, formData: FormData ) =>
{
    const { orgId } = await getUserAndOrgId();
    const name = formData.get( 'name' ) as string;

    const updatedEvent = {
        name,
        updatedAt: new Date(),
        // Add other fields if necessary
    };

    await db
        .update( events )
        .set( updatedEvent )
        .where( and( eq( events.id, eventId ), eq( events.orgId, orgId ) ) );

    // Revalidate the path to refresh the page
    revalidatePath( `/dashboard/${ orgId }` );

    return updatedEvent;
};

// Delete an event
export const deleteEvent = async ( eventId: string ) =>
{
    const { orgId } = await getUserAndOrgId();

    await db.delete( events ).where( and( eq( events.id, eventId ), eq( events.orgId, orgId ) ) );

    // Revalidate the path to refresh the page
    revalidatePath( `/dashboard/${ orgId }` );

    return { success: true };
};
