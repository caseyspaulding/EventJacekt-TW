// app/actions/getEventIdBySlug.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function getEventIdBySlug(slug: string) {
    console.log('Fetching event ID for slug:', slug); // Debug log
    const supabase = createClient();

    const { data: event, error } = await supabase
        .from('events')
        .select('id')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error('Error fetching event:', error);
        return null;
    }

    return event?.id || null;
}
