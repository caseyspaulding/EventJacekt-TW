'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';
import { getEventsForOrg } from '@/app/actions/getEventsForOrg';
import { deleteEvent } from '@/app/actions/eventActions'; // Ensure this action is correctly implemented
import BreadcrumbsPageHeader from '../components/BreadcrumbsPageHeading';

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

  const handleDelete = async ( eventId: string ) =>
  {
    if ( confirm( 'Are you sure you want to delete this event?' ) )
    {
      try
      {
        const response = await deleteEvent( eventId );

        if ( response.success )
        {
          setEvents( events.filter( ( event ) => event.id !== eventId ) );
        } else
        {
          setError( response.error || 'Failed to delete event' );
        }
      } catch ( error )
      {
        console.error( 'Failed to delete event:', error );
        setError( 'Failed to delete event' );
      }
    }
  };

  if ( loading )
  {
    return <p>Loading events...</p>;
  }

  if ( error )
  {
    return <p className="text-red-600">{ error }</p>;
  }

  const breadcrumbs = [
    { name: 'Dashboard', href: '/' },
    { name: 'All Events', href: '/events', current: true },
  ];

  return (
    <div className="sm:px-6">
      <BreadcrumbsPageHeader title="All Events" breadcrumbs={ breadcrumbs } />
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <p className="mt-2 text-sm text-gray-700">
            A list of all the events in your organization including their name, description, start date, end date, and status.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link href={ `/dashboard/${ user?.orgName }/events/new` }>
            <div className="block rounded-md bg-orange-500 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600">
              Add New Event
            </div>
          </Link>
        </div>
      </div>

      {/* Responsive Table */ }
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50 hidden md:table-header-group">
                  <tr>
                    <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Event Title</th>
                    <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Start Date</th>
                    <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">End Date</th>
                    <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  { events.length > 0 ? (
                    events.map( ( event ) => (
                      <tr key={ event.id } className="block md:table-row md:border-none md:shadow-none mb-4 md:mb-0">
                        <td className="block md:table-cell px-3 py-2">
                          <strong className="md:hidden">Event Title: </strong> { event.name }
                        </td>
                        <td className="block md:table-cell px-3 py-2">
                          <strong className="md:hidden">Start Date: </strong> { event.startDate ? new Date( event.startDate ).toLocaleDateString() : 'No start date' }
                        </td>
                        <td className="block md:table-cell px-3 py-2">
                          <strong className="md:hidden">End Date: </strong> { event.endDate ? new Date( event.endDate ).toLocaleDateString() : 'No end date' }
                        </td>
                        <td className="block md:table-cell px-3 py-2">
                          <Link href={ `/dashboard/${ user?.orgName }/events/${ event.slug }/edit` }>
                            <div className="text-blue-600 hover:text-blue-900 cursor-pointer">
                              Edit<span className="sr-only">, { event.name }</span>
                            </div>
                          </Link>
                          <button
                            onClick={ () => handleDelete( event.id ) }
                            className="text-blue-600 hover:text-blue-900 cursor-pointer "
                          >
                            Delete<span className="sr-only">, { event.name }</span>
                          </button>
                        </td>
                      </tr>
                    ) )
                  ) : (
                    <tr>
                      <td colSpan={ 4 } className="px-3 py-2 text-center text-sm text-gray-500">
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
