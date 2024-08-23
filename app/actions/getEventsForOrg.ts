// actions/getEvents.ts
'use server';

import { db } from '@/db';
import { events, organizations } from '@/db/schema';
import { eq } from 'drizzle-orm/expressions';

type EventType = {
  id: string;
  name: string;
  featuredImage: string | null;
  slug: string;
  description: string | null;
  startDate: Date | null;
  endDate: Date | null;
  venue: string | null;
  createdAt: Date | null;
  status: string;
  organizationName: string;
};

export async function getEventsForOrg ( orgName: string ): Promise<EventType[]>
{
  // Fetch events for a specific organization from the database, ordered by their creation date
  const eventList: EventType[] = await db
    .select( {
      id: events.id,
      name: events.name,
      featuredImage: events.featuredImage,
      slug: events.slug,
      description: events.description,
      startDate: events.startDate,
      endDate: events.endDate,
      venue: events.venue,
      createdAt: events.createdAt,
      status: events.status,
      organizationName: organizations.name, // Fetch organization name via join
    } )
    .from( events )
    .innerJoin( organizations, eq( events.orgId, organizations.id ) )
    .where( eq( organizations.name, orgName ) )
    .orderBy( events.createdAt );

  return eventList;
}
