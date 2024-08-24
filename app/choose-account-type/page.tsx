'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@nextui-org/react';

export default function ChooseAccountTypePage ()
{
  const router = useRouter();

  // Handlers for button clicks to navigate to respective registration pages
  const handleAttendeeRegistration = () =>
  {
    router.push( '/registration/attendee' );
  };

  const handleOrganizationRegistration = () =>
  {
    router.push( '/registration/organization' );
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-r from-blue-600 via-sky-400 to-blue-600 px-4">
      <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small text-center">
        <h1 className="text-2xl font-bold text-blue-600">Choose Account Type</h1>
        <p className="text-sm text-gray-800">Please select the type of account you want to create:</p>
        <div className="flex flex-col gap-4 mt-6">
          <Button
            onClick={ handleAttendeeRegistration }
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Register as Attendee
          </Button>
          <Button
            onClick={ handleOrganizationRegistration }
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Register as Organization
          </Button>
        </div>
      </div>
    </div>
  );
}
