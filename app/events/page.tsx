import React from 'react';
import Link from 'next/link';
import { db } from '@/db';
import { events, organizations } from '@/db/schema';
import NavBar1 from '@/components/NavBarTW/NavBar1';
import FooterFull from '@/components/Footers/FooterFull';
import HeaderCentered from '@/components/HeaderCentered';
import { Metadata } from 'next';
import { eq } from 'drizzle-orm/expressions'; 

export const metadata: Metadata = {
  title: 'Events - EventJacket',
  description: 'Explore the events organized with EventJacket.',
};

export default async function EventsList ()
{
  // Fetch all events from the database, ordered by their creation date
  const eventList = await db
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
      organizationName: organizations.name, // Fetch organization name via join
    } )
    .from( events )
    .innerJoin( organizations, eq( events.orgId, organizations.id ) )
    .orderBy( events.createdAt );

  return (
    <>
      <NavBar1 />
      <HeaderCentered
        title="Events"
        description="Explore the events organized with EventJacket."
      />
      <div className="bg-white mb-28 ">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            {/* You can add some introductory text or a subtitle here */ }
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            { eventList.map( ( event ) => (
              <article key={ event.id } className="flex flex-col items-start justify-between">
                <Link href={ `/events/${ event.slug }` }>
                  <div className="relative w-full">
                    <img
                      alt={ event.name }
                      src={ event.featuredImage || '/images/festival-4.webp' }
                      className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                    />
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                  </div>
                </Link>
                <div className="max-w-xl">
                  <div className="mt-8 flex items-center gap-x-4 text-xs">
                    By { event.organizationName } on { event.createdAt ? new Date( event.createdAt ).toLocaleDateString() : 'N/A' }
                  </div>
                  <div className="group relative">
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                      <Link href={ `/events/${ event.slug }` }>
                        <span className="absolute inset-0" />
                        { event.name }
                      </Link>
                    </h3>
                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{ event.description }</p>
                  </div>
                </div>
              </article>
            ) ) }
          </div>
        </div>
      </div>
      <FooterFull />
    </>
  );
}
