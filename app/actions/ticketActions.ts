'use server';

import { db } from '@/db';
import { ticketTypes, tickets } from '@/db/schema';
import { createClient } from '@/utils/supabase/server';

import { and, eq } from 'drizzle-orm/expressions';
import { revalidatePath } from 'next/cache';

// Create a new ticket type
export async function createTicketType ( formData: FormData ) 
{
  const { orgId } = await getUserAndOrgId();

  const eventId = formData.get( 'eventId' ) as string;
  const name = formData.get( 'name' ) as string;
  const description = formData.get( 'description' ) as string || null; // Handle optional field
  const price = formData.get( 'price' ) as string; // Keep it as a string
  const quantity = parseInt( formData.get( 'quantity' ) as string, 10 );
  const saleStartDate = new Date( formData.get( 'saleStartDate' ) as string );
  const saleEndDate = new Date( formData.get( 'saleEndDate' ) as string );
  const eventDate = new Date( formData.get( 'eventDate' ) as string );
  const isEarlyBird = formData.get( 'isEarlyBird' ) === 'true';
  const maxPerCustomer = formData.get( 'maxPerCustomer' )
    ? parseInt( formData.get( 'maxPerCustomer' ) as string, 10 )
    : null; // Handle optional field

  const newTicketType = {
    eventId: eventId,
    orgId: orgId,
    name: name,
    description: description,
    price: price,
    quantity: quantity,
    saleStartDate: saleStartDate.toISOString().split( 'T' )[ 0 ], // Convert to 'YYYY-MM-DD'
    saleEndDate: saleEndDate.toISOString().split( 'T' )[ 0 ],     // Convert to 'YYYY-MM-DD'
    eventDate: eventDate.toISOString().split( 'T' )[ 0 ],         // Convert to 'YYYY-MM-DD'
    isEarlyBird: isEarlyBird,
    maxPerCustomer: maxPerCustomer,
    createdAt: new Date(), // You can keep this as a Date object if it will be converted later
    updatedAt: new Date(), // You can keep this as a Date object if it will be converted later
  };

  try
  {
    await db.insert( ticketTypes ).values( newTicketType );
    revalidatePath( `/dashboard/${ orgId }/events/${ eventId }/create-tickets` );
    return { success: true, message: 'Ticket type created successfully' };
  } catch ( error )
  {
    console.error( 'Error inserting ticket type:', error );
    return { success: false, message: 'Error inserting ticket type into database' };
  }
};

// Update an existing ticket type
export async function updateTicketType ( ticketTypeId: string, formData: FormData ) 
{
  const { orgId } = await getUserAndOrgId();

  const name = formData.get( 'name' ) as string;
  const description = formData.get( 'description' ) as string;
  const price = parseFloat( formData.get( 'price' ) as string );
  const quantity = parseInt( formData.get( 'quantity' ) as string, 10 );
  const saleStartDate = new Date( formData.get( 'saleStartDate' ) as string );
  const saleEndDate = new Date( formData.get( 'saleEndDate' ) as string );
  const eventDate = new Date( formData.get( 'eventDate' ) as string );
  const isEarlyBird = formData.get( 'isEarlyBird' ) === 'true';
  const maxPerCustomer = parseInt( formData.get( 'maxPerCustomer' ) as string, 10 );

  const updatedTicketType = {
    name,
    description,
    price: price.toString(),
    quantity,
    saleStartDate: saleStartDate.toISOString().split( 'T' )[ 0 ], // Convert to 'YYYY-MM-DD'
    saleEndDate: saleEndDate.toISOString().split( 'T' )[ 0 ],     // Convert to 'YYYY-MM-DD'
    eventDate: eventDate.toISOString().split( 'T' )[ 0 ],
    isEarlyBird,
    maxPerCustomer,
    updatedAt: new Date(),
  };

  try
  {
    await db.update( ticketTypes ).set( updatedTicketType ).where( and( eq( ticketTypes.id, ticketTypeId ), eq( ticketTypes.orgId, orgId ) ) );
    revalidatePath( `/dashboard/${ orgId }/events/${ ticketTypeId }/manage-tickets` );
    return { success: true, message: 'Ticket type updated successfully' };
  } catch ( error )
  {
    console.error( 'Error updating ticket type:', error );
    return { success: false, message: 'Error updating ticket type' };
  }
};

// Delete a ticket type
export async function deleteTicketType ( ticketTypeId: string ) 
{
  const { orgId } = await getUserAndOrgId();

  try
  {
    await db.delete( ticketTypes ).where( and( eq( ticketTypes.id, ticketTypeId ), eq( ticketTypes.orgId, orgId ) ) );
    revalidatePath( `/dashboard/${ orgId }/manage-events` );
    return { success: true, message: 'Ticket type deleted successfully' };
  } catch ( error )
  {
    console.error( 'Error deleting ticket type:', error );
    return { success: false, message: 'Error deleting ticket type' };
  }
};

// Fetch ticket types for the current event
export async function fetchTicketTypesForEvent ( eventId: string ) 
{
  const { orgId } = await getUserAndOrgId();

  try
  {
    const ticketTypesData = await db.select().from( ticketTypes ).where( and( eq( ticketTypes.eventId, eventId ), eq( ticketTypes.orgId, orgId ) ) );
    return ticketTypesData;
  } catch ( error )
  {
    console.error( 'Error fetching ticket types:', error );
    return [];
  }
};

// Utility function to get user and organization ID
export async function getUserAndOrgId () 
{
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if ( userError || !user )
  {
    throw new Error( 'Not authenticated' );
  }

  const { data: profile, error: profileError } = await supabase.from( 'user_profiles' ).select( 'org_id' ).eq( 'user_id', user.id ).single();

  if ( profileError || !profile )
  {
    throw new Error( 'No organization found' );
  }

  return { user, orgId: profile.org_id };
};
