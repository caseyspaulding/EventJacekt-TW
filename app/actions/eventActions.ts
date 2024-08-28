'use server';

import { db } from '@/db';
import { events, orgEventTickets, orgTicketTypes } from '@/db/schema';
import { createClient } from '@/utils/supabase/server';

import { revalidatePath } from 'next/cache';
import { eq, inArray, and } from 'drizzle-orm/expressions'; 


// Get an event by its slug
export async function getEventBySlug ( eventSlug: string )
{
    const [ event ] = await db
        .select( {
            id: events.id,
            name: events.name,
            slug: events.slug,
            description: events.description,
            startDate: events.startDate,
            endDate: events.endDate,
            venue: events.venue,
            address: events.address,
            city: events.city,
            state: events.state,
            country: events.country,
            zipCode: events.zipCode,
            maxAttendees: events.maxAttendees,
            featuredImage: events.featuredImage,
            // Include other fields if necessary
        } )
        .from( events )
        .where( eq( events.slug, eventSlug ) );

    if ( !event )
    {
        throw new Error( 'Event not found' );
    }

    return event;
}

// Create a new event
export const createEvent = async ( formData: FormData ) =>
{
    const { orgId } = await getUserAndOrgId();

    const name = formData.get( 'name' ) as string;
    const slug = formData.get( 'slug' ) as string;
    const description = formData.get( 'description' ) as string;
    const startDate = new Date( formData.get( 'startDate' ) as string );
    const endDate = new Date( formData.get( 'endDate' ) as string );
    const venue = formData.get( 'venue' ) as string;
    const address = formData.get( 'address' ) as string;
    const city = formData.get( 'city' ) as string;
    const state = formData.get( 'state' ) as string;
    const country = formData.get( 'country' ) as string;
    const zipCode = formData.get( 'zipCode' ) as string;
    const maxAttendees = parseInt( formData.get( 'maxAttendees' ) as string, 10 );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const status = formData.get( 'status' ) as string;
    const featuredImage = formData.get( 'featuredImage' ) as string;

    // const slug = name.toLowerCase().replace( /\s+/g, '-' ); // Example slug generation

    const newEvent = {
        orgId,
        name,
        slug,
        description,
        startDate,
        endDate,
        venue,
        address,
        city,
        state,
        country,
        zipCode,
        maxAttendees,
        featuredImage,
        status: 'draft', // Default status, adjust as needed
        createdAt: new Date(),
        updatedAt: new Date()
    };
    try
    {
        await db.insert( events ).values( newEvent );
        return { success: true, message: 'Event created successfully' };
    } catch ( error )
    {
        console.error( 'Error inserting event:', error );
        return { success: false, message: 'Error inserting event into database' };
    }
};

// Update an existing event
export const updateEvent = async ( eventId: string, formData: FormData ) =>
{
    const { orgId } = await getUserAndOrgId();

    const name = formData.get( 'name' ) as string;
    const description = formData.get( 'description' ) as string;
    const startDate = new Date( formData.get( 'startDate' ) as string );
    const endDate = new Date( formData.get( 'endDate' ) as string );
    const venue = formData.get( 'venue' ) as string;
    const address = formData.get( 'address' ) as string;
    const city = formData.get( 'city' ) as string;
    const state = formData.get( 'state' ) as string;
    const country = formData.get( 'country' ) as string;
    const zipCode = formData.get( 'zipCode' ) as string;
    const maxAttendees = Number( formData.get( 'maxAttendees' ) );
    const featuredImage = formData.get( 'featuredImage' ) as string;

    const updatedEvent = {
        name,
        description,
        startDate,
        endDate,
        venue,
        address,
        city,
        state,
        country,
        zipCode,

        maxAttendees,
        featuredImage,
        updatedAt: new Date()
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
    try
    {
        const { orgId } = await getUserAndOrgId();

        // Step 1: Find all ticket types associated with the event
        const ticketTypeIds = await db.select( {
            id: orgTicketTypes.id,
        } )
            .from( orgTicketTypes )
            .where( eq( orgTicketTypes.eventId, eventId ) );

        // Step 2: Extract ticket type IDs from the result
        const ticketTypeIdsArray = ticketTypeIds.map( ticketType => ticketType.id );

        // Step 3: Delete all related records in orgEventTickets
        await db.delete( orgEventTickets )
            .where( inArray( orgEventTickets.ticketTypeId, ticketTypeIdsArray ) );

        // Step 4: Delete all related ticket types before deleting the event
        await db.delete( orgTicketTypes )
            .where( eq( orgTicketTypes.eventId, eventId ) );

        // Step 5: Delete the event itself
        await db.delete( events )
            .where( and( eq( events.id, eventId ), eq( events.orgId, orgId ) ) );

        // Step 6: Revalidate the paths to refresh the pages
        await revalidatePath( `/dashboard/${ orgId }/events` );
        await revalidatePath( '/' ); // Revalidate the homepage path

        return { success: true };
    } catch ( error )
    {
        console.error( 'Error deleting event:', error );
        return { success: false, error: 'Failed to delete event' };
    }
};

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
