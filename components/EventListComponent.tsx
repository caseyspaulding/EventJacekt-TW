import React from 'react';
import Link from 'next/link';
import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';

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
    <section className="py-16 mt-5 mx-auto max-w-7xl ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
       
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          { eventList.map( ( event ) => (
            <article key={ event.id } className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
              <Link href={ `/events/${ event.slug }` } className="block">
                <div className="relative h-48 w-full">
                  <img
                    src={ event.featuredImage || '/images/festival-4.webp' }
                    alt={ event.name }
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 hover:text-blue-600">
                    { event.name }
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{ event.description }</p>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    { event.startDate ? new Date( event.startDate ).toLocaleDateString() : 'TBA' }
                  </div>
                  { event.venue && (
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPinIcon className="w-4 h-4 mr-2" />
                      { event.venue }
                    </div>
                  ) }
                </div>
              </Link>
              <div className="px-6 py-4 bg-gray-100">
                <p className="text-xs text-gray-500">
                  By { event.organizationName } on { event.createdAt ? new Date( event.createdAt ).toLocaleDateString() : 'N/A' }
                </p>
              </div>
            </article>
          ) ) }
        </div>
      </div>
    </section>
  );
};

export default EventsListComponent;