// EventsListComponent.tsx
import React from 'react';
import Link from 'next/link';

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
  organizationName: string;
};

interface EventsListComponentProps
{
  eventList: EventType[];
}

const EventsListComponent: React.FC<EventsListComponentProps> = ( { eventList } ) =>
{
  return (
    <div className="mb-28 ">
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
              <div className="max-w-xl ">
                <div className="mt-2 flex items-center gap-x-4 text-xs text-gray-500">
                  By { event.organizationName } on{ ' ' }
                  { event.createdAt ? new Date( event.createdAt ).toLocaleDateString() : 'N/A' }
                </div>
                <div className="group relative">
                  <h3 className="mt-1 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                    <Link href={ `/events/${ event.slug }` }>
                      <span className="absolute inset-0" />
                      { event.name }
                    </Link>
                  </h3>
                  <p className="line-clamp-3 text-sm leading-6 text-gray-600">
                    { event.description }
                  </p>
                </div>
              </div>
            </article>
          ) ) }
        </div>
      </div>
    </div>
  );
};

export default EventsListComponent;
