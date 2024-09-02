'use client'; 

import { useEffect, useState } from "react";
import { BuildingOfficeIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/button";

interface UserProfileHeaderProps
{
  userName: string;
  organizationName: string;
  userImageUrl: string;
  accountStatus: string;
  orgId: string; // Add a new prop for dynamic routing
}

const UserProfileHeaderDashboard: React.FC<UserProfileHeaderProps> = ( {
  userName,
  organizationName,
  userImageUrl,
  accountStatus,
  orgId, // Receive orgId as a prop
} ) =>
{
  const [ greeting, setGreeting ] = useState( "Good Morning" );

  useEffect( () =>
  {
    const currentHour = new Date().getHours();

    if ( currentHour < 12 )
    {
      setGreeting( "Good Morning" );
    } else if ( currentHour < 18 )
    {
      setGreeting( "Good Afternoon" );
    } else
    {
      setGreeting( "Good Evening" );
    }
  }, [] );

  return (
    <div className="bg-white">
      <div className="lg:max-w-6xl">
        <div className="py-6 md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            {/* Profile */ }
            <div className="flex items-center">
              <img
                alt={ userName }
                src={ userImageUrl }
                className="hidden h-16 w-16 rounded-full sm:block"
              />
              <div>
                <div className="flex items-center">
                  <img
                    alt={ userName }
                    src={ userImageUrl }
                    className="h-16 w-16 rounded-full sm:hidden"
                  />
                  <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9">
                    { greeting }👋, { userName }
                  </h1>
                </div>
                <dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                  <dt className="sr-only">Company</dt>
                  <dd className="flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6">
                    <BuildingOfficeIcon
                      aria-hidden="true"
                      className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                    />
                    { organizationName }
                  </dd>
                  <dt className="sr-only">Account status</dt>
                  <dd className="mt-3 flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6 sm:mt-0">
                    <CheckCircleIcon
                      aria-hidden="true"
                      className="mr-1.5 h-5 w-5 flex-shrink-0 text-green-500"
                    />
                    { accountStatus }
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col space-y-3 md:flex-row md:space-x-3 md:space-y-0 md:ml-4 md:mt-0">
            <Button
              as="a"
              href={ `/dashboard/${ orgId }/events` } // Dynamic route for managing events
              className="w-full md:w-auto inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-green-50 hover:ring-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            >
              Manage Event
            </Button>
            <Button
              as="a"
              href={ `/dashboard/${ orgId }/events/new` } // Dynamic route for creating an event
              className="w-full md:w-auto inline-flex items-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            >
              Create Event
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeaderDashboard;
