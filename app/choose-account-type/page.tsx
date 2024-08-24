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
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-r from-gray-100 via-slate-100 to-gray-100 px-4">
      <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-lg bg-content1 border-blue-300 border-1 px-8 py-6 shadow-2xl text-center">
        <img src="/images/logo.svg" alt="EventJacket" className="h-12 w-auto mx-auto" />
        <h1 className="text-2xl font-bold text-blue-700">Choose Account Type</h1>
        <p className="text-sm text-gray-800">Attend events or create events?</p>
        <div className="flex flex-row justify-center gap-11 m-6 ">
          <Button
            onClick={ handleAttendeeRegistration }
            className="flex flex-col items-center justify-center w-25 h-25 bg-orange-500 hover:bg-orange-600 text-white shadow-lg"
            radius='sm'

          >

            <span className="my-8  px-1 font-medium text-sm">Attend Events</span> {/* Centered text below the icon */ }
          </Button>
          <Button
            onClick={ handleOrganizationRegistration }
            className="flex flex-col items-center justify-center w-25 h-25 bg-orange-500 hover:bg-orange-600 text-white shadow-lg"
            radius='sm'
          >

            <span className="px-1 font-medium  text-sm">Create Events </span> {/* Centered text below the icon */ }

          </Button>
        </div>
      </div>
    </div>
  );
}
