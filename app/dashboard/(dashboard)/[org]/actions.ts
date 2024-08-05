'use server';

import { db } from '@/db';
import { events } from '@/db/schema';
import { createClient } from '@/utils/supabase/server';
import { and, eq } from 'drizzle-orm/expressions';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

export const getUserAndOrgId = async () => {
    const supabase = createClient();
    const {
        data: { user },
        error: userError
    } = await supabase.auth.getUser();
    if (userError || !user) {
        throw new Error('Not authenticated');
    }

    const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('org_id')
        .eq('user_id', user.id)
        .single();

    if (profileError || !profile) {
        throw new Error('No organization found');
    }

    return { user, orgId: profile.org_id };
};

export const fetchEventsForOrg = async () => {
    const { orgId } = await getUserAndOrgId();

    const eventsData = await db.select().from(events).where(eq(events.orgId, orgId));

    return eventsData;
};

export const createEvent = async (formData: FormData) => {
    const { orgId } = await getUserAndOrgId();
    const name = formData.get('name') as string;

    const newEvent = {
        id: uuidv4(),
        orgId,
        name,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    await db.insert(events).values(newEvent);

    // Revalidate the path to refresh the page
    revalidatePath(`/dashboard/${orgId}`);
    return newEvent;
};

export const updateEvent = async (eventId: string, formData: FormData) => {
    const { orgId } = await getUserAndOrgId();
    const name = formData.get('name') as string;

    const updatedEvent = {
        name,
        updatedAt: new Date()
    };

    await db
        .update(events)
        .set(updatedEvent)
        .where(and(eq(events.id, eventId), eq(events.orgId, orgId)));

    // Revalidate the path to refresh the page
    revalidatePath(`/dashboard/${orgId}`);

    return updatedEvent;
};

export const deleteEvent = async (eventId: string) => {
    const { orgId } = await getUserAndOrgId();

    await db.delete(events).where(and(eq(events.id, eventId), eq(events.orgId, orgId)));

    // Revalidate the path to refresh the page
    revalidatePath(`/dashboard/${orgId}`);

    return { success: true };
};
