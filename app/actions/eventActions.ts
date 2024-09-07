'use server';

import { db } from '@/db';
import { agenda, events, organizations, orgEventTickets, orgTicketTypes } from '@/db/schema';
import { createClient } from '@/utils/supabase/server';

import { revalidatePath } from 'next/cache';
import { eq, inArray, and } from 'drizzle-orm/expressions';
import { getEventIdBySlug } from './getEventIdBySlug';





// Get an event by its slug for updating purposes
export async function getEventBySlug ( eventSlug: string )
{
    const [ event ] = await db
        .select( {
            id: events.id,
            orgId: events.orgId,
            name: events.name,
            featuredImage: events.featuredImage,
            slug: events.slug,
            description: events.description,
            notes: events.notes,
            startDate: events.startDate,
            endDate: events.endDate,
            eventStartTime: events.eventStartTime,
            eventEndTime: events.eventEndTime,
            venue: events.venue,
            venueDescription: events.venueDescription,
            venueImage: events.venueImage,
            address: events.address,
            city: events.city,
            state: events.state,
            country: events.country,
            zipCode: events.zipCode,
            latitude: events.latitude,
            longitude: events.longitude,
            scheduleDetails: events.scheduleDetails,
            bannerImage: events.bannerImage,
            galleryImages: events.galleryImages,
            videoLinks: events.videoLinks,
            organizerContact: events.organizerContact,
            maxAttendees: events.maxAttendees,
            status: events.status,
            refundPolicy: events.refundPolicy,
            timezone: events.timezone,
            tags: events.tags,
            highlights: events.highlights,
            faqs: events.faqs,
            ageRestriction: events.ageRestriction,
            parkingOptions: events.parkingOptions,
            createdAt: events.createdAt,
            updatedAt: events.updatedAt,
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

    // Extract data from formData
    const name = formData.get( 'name' ) as string;
    const slug = formData.get( 'slug' ) as string;
    const description = formData.get( 'description' ) as string;
    const startDateString = formData.get( 'startDate' ) as string;
    const endDateString = formData.get( 'endDate' ) as string;
    const eventStartTime = formData.get( 'eventStartTime' ) as string;
    const eventEndTime = formData.get( 'eventEndTime' ) as string;
    const venue = formData.get( 'venue' ) as string;
    const address = formData.get( 'address' ) as string;
    const city = formData.get( 'city' ) as string;
    const state = formData.get( 'state' ) as string;
    const country = formData.get( 'country' ) as string;
    const zipCode = formData.get( 'zipCode' ) as string;
    const maxAttendees = parseInt( formData.get( 'maxAttendees' ) as string, 10 );
    const featuredImage = formData.get( 'featuredImage' ) as string;
    const notes = formData.get( 'notes' ) as string;
    const scheduleDetails = formData.get( 'scheduleDetails' ) as string;
    const refundPolicy = formData.get( 'refundPolicy' ) as string;
    const timezone = formData.get( 'timezone' ) as string;
    const tags = ( formData.get( 'tags' ) as string ).split( ',' ).map( ( tag ) => tag.trim() );
    const faqs = JSON.parse( formData.get( 'faqs' ) as string );
    const highlights = ( formData.get( 'highlights' ) as string ).split( ',' ).map( ( highlight ) => highlight.trim() );
    const ageRestriction = formData.get( 'ageRestriction' ) as string;
    const parkingOptions = formData.get( 'parkingOptions' ) as string;
    const agendaItemsRaw = formData.get( 'agendaItems' ) as string;

    // Parse JSON string for agenda items
    let agendaItems;
    try
    {
        agendaItems = JSON.parse( agendaItemsRaw );
    } catch ( error )
    {
        console.error( 'Error parsing agenda items:', error );
        return { success: false, message: 'Invalid agenda items format' };
    }

    // Validation
    if ( !name || !slug || !startDateString || !endDateString )
    {
        return { success: false, message: 'Missing required fields' };
    }

    if ( isNaN( maxAttendees ) )
    {
        return { success: false, message: 'Invalid number for max attendees' };
    }

    // Prepare the new event object
    const newEvent = {
        orgId,
        name,
        slug,
        description,
        startDate: startDateString,  // Use plain date string
        endDate: endDateString,      // Use plain date string
        eventStartTime, // Use plain time string
        eventEndTime,   // Use plain time string
        venue: venue || null,
        address: address || null,
        city: city || null,
        state: state || null,
        country: country || null,
        zipCode: zipCode || null,
        maxAttendees,
        featuredImage: featuredImage || null,
        notes: notes || null,
        scheduleDetails: scheduleDetails || null,
        refundPolicy: refundPolicy || null,
        timezone: timezone || null,
        tags: tags || [],
        faqs: faqs || [],
        highlights: highlights || [],
        ageRestriction: ageRestriction || null,
        parkingOptions: parkingOptions || null,
        status: 'draft', // Default status
    };

    try
    {
        // Insert new event into events table and get the ID
        const [ insertedEvent ] = await db.insert( events ).values( newEvent ).returning( { id: events.id } );

        // Handle agenda items
        if ( agendaItems.length > 0 )
        {
            const agendaData = agendaItems.map( ( item: { title: string; startTime: string; endTime: string; description: string; hostOrArtist: string; } ) =>
            {
                // Validate and format start and end times
                const formattedStartTime = item.startTime ? item.startTime : null;
                const formattedEndTime = item.endTime ? item.endTime : null;

                return {
                    eventId: insertedEvent.id,
                    title: item.title,
                    startTime: formattedStartTime,  // Ensure this is a valid time format 'HH:mm'
                    endTime: formattedEndTime,      // Ensure this is a valid time format 'HH:mm'
                    description: item.description,
                    hostOrArtist: item.hostOrArtist,
                };
            } );

            await db.insert( agenda ).values( agendaData );
        }

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

    // Extract fields from formData
    const name = formData.get( 'name' ) as string;
    const description = formData.get( 'description' ) as string;

    const startDate = new Date( formData.get( 'startDate' ) as string );

    const endDate = new Date( formData.get( 'endDate' ) as string );

    const eventStartTime = formData.get( 'eventStartTime' ) as string; // New field
    const eventEndTime = formData.get( 'eventEndTime' ) as string; // New field
    const venue = formData.get( 'venue' ) as string;
    const address = formData.get( 'address' ) as string;
    const city = formData.get( 'city' ) as string;
    const state = formData.get( 'state' ) as string;
    const country = formData.get( 'country' ) as string;
    const zipCode = formData.get( 'zipCode' ) as string;
    const maxAttendees = Number( formData.get( 'maxAttendees' ) );
    const featuredImage = formData.get( 'featuredImage' ) as string;
    const notes = formData.get( 'notes' ) as string; // New field
    const scheduleDetails = formData.get( 'scheduleDetails' ) as string; // New field
    const refundPolicy = formData.get( 'refundPolicy' ) as string; // New field
    const timezone = formData.get( 'timezone' ) as string; // New field
    const tags = formData.get( 'tags' ) as string; // New field
    const highlights = formData.get( 'highlights' ) as string; // New field
    const ageRestriction = formData.get( 'ageRestriction' ) as string; // New field
    const parkingOptions = formData.get( 'parkingOptions' ) as string; // New field

    // Convert Date objects to strings in 'YYYY-MM-DD' format
    const formattedStartDate = startDate.toString().split( 'T' )[ 0 ];
    const formattedEndDate = endDate.toString().split( 'T' )[ 0 ];

    // Prepare updated event data
    const updatedEvent = {
        name,
        description,
        startDate: formattedStartDate, // Convert Date to string
        endDate: formattedEndDate, // Convert Date to string
        eventStartTime, // New field
        eventEndTime, // New field
        venue,
        address,
        city,
        state,
        country,
        zipCode,
        maxAttendees,
        featuredImage,
        notes, // New field
        scheduleDetails, // New field
        refundPolicy, // New field
        timezone, // New field
        tags: tags.split( ',' ).map( tag => tag.trim() ), // Convert string to array if necessary
        highlights: highlights.split( ',' ).map( highlight => highlight.trim() ), // Convert string to array if necessary
        ageRestriction, // New field
        parkingOptions, // New field

    };

    try
    {
        // Update the event in the database
        await db
            .update( events )
            .set( updatedEvent )
            .where( and( eq( events.id, eventId ), eq( events.orgId, orgId ) ) );

        // Revalidate the path to refresh the page
        revalidatePath( `/dashboard/${ orgId }` );

        return { success: true, updatedEvent };
    } catch ( error )
    {
        console.error( 'Error updating event:', error );
        return { success: false, message: 'Error updating event in database' };
    }
};


// Delete an event
export const deleteEvent = async ( eventId: string ) =>
{
    try
    {
        const { orgId } = await getUserAndOrgId();

        // Step 1: Find all ticket types associated with the event
        const ticketTypeIds = await db
            .select( { id: orgTicketTypes.id } )
            .from( orgTicketTypes )
            .where( eq( orgTicketTypes.eventId, eventId ) );

        // Step 2: Extract ticket type IDs from the result
        const ticketTypeIdsArray = ticketTypeIds.map( ( ticketType ) => ticketType.id );

        // Step 3: Delete all related records in orgEventTickets
        await db.delete( orgEventTickets ).where( inArray( orgEventTickets.ticketTypeId, ticketTypeIdsArray ) );

        // Step 4: Delete all related ticket types before deleting the event
        await db.delete( orgTicketTypes ).where( eq( orgTicketTypes.eventId, eventId ) );

        // Step 5: Delete all related records in the agenda table
        await db.delete( agenda ).where( eq( agenda.eventId, eventId ) );

        // Step 6: Delete the event itself
        await db.delete( events ).where( and( eq( events.id, eventId ), eq( events.orgId, orgId ) ) );

        // Step 7: Revalidate the paths to refresh the pages
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


export async function fetchEventData ( eventSlug: string )
{
    const eventId = await getEventIdBySlug( eventSlug );

    if ( !eventId )
    {
        return null;
    }

    const eventWithOrg = await db
        .select( {
            eventId: events.id,
            eventName: events.name,
            description: events.description,
            startDate: events.startDate,
            endDate: events.endDate,
            featuredImage: events.featuredImage,
            venue: events.venue,
            city: events.city,
            state: events.state,
            zipCode: events.zipCode,
            country: events.country,
            orgId: events.orgId,
            orgName: organizations.name,
        } )
        .from( events )
        .innerJoin( organizations, eq( events.orgId, organizations.id ) )
        .where( eq( events.id, eventId ) )
        .limit( 1 );

    return eventWithOrg[ 0 ]; // Assuming you always have one event per ID
}