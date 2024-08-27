'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';
import { getEventsForOrg} from '@/app/actions/getEventsForOrg';

interface Event
{
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
}

export default function EventsPage ()
{
  const { user } = useUser();
  const [ events, setEvents ] = useState<Event[]>( [] );
  const [ loading, setLoading ] = useState( true );
  const [ error, setError ] = useState<string | null>( null );

  useEffect( () =>
  {
    async function fetchEvents ()
    {
      if ( !user?.orgName )
      {
        setError( 'Organization not found' );
        setLoading( false );
        return;
      }

      try
      {
        const fetchedEvents = await getEventsForOrg( user.orgName );
        setEvents( fetchedEvents );
      } catch ( error )
      {
        console.error( 'Failed to fetch events:', error );
        setError( 'Failed to fetch events' );
      } finally
      {
        setLoading( false );
      }
    }

    fetchEvents();
  }, [ user?.orgName ] );

  if ( loading )
  {
    return <p>Loading events...</p>;
  }

  if ( error )
  {
    return <p className="text-red-600">{ error }</p>;
  }

  return (
    <div className="sm:px-6 ">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold leading-6 text-gray-900">Your Events</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the events in your organization including their name, description, start date, end date, and status.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link href={`/dashboard/{orgName}/events/new`}>
            <div className="block rounded-md bg-orange-500 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600">
              Add New Event
            </div>
          </Link>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Event
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Start Date
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      End Date
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  { events.length > 0 ? (
                    events.map( ( event ) => (
                      <tr key={ event.id }>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          <div>{ event.name }</div>
                          <div className="text-gray-500">{ event.description || 'No description' }</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          { event.startDate ? new Date( event.startDate ).toLocaleDateString() : 'No start date' }
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          { event.endDate ? new Date( event.endDate ).toLocaleDateString() : 'No end date' }
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span
                            className={ `inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${ event.status === 'active'
                              ? 'bg-green-50 text-green-700 ring-green-600/20'
                              : 'bg-gray-50 text-gray-700 ring-gray-600/20'
                              }` }
                          >
                            { event.status }
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <Link href={ `/dashboard/events/${ event.id }/edit` }>
                            <div className="text-indigo-600 hover:text-indigo-900">
                              Edit<span className="sr-only">, { event.name }</span>
                            </div>
                          </Link>
                        </td>
                      </tr>
                    ) )
                  ) : (
                    <tr>
                      <td colSpan={ 5 } className="py-4 text-center text-gray-500">
                        No events found.
                      </td>
                    </tr>
                  ) }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
