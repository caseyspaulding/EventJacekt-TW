'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@nextui-org/react';
import { Icon } from '@iconify/react/dist/iconify.js';

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
      <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-lg bg-content1 px-8 py-6 shadow-2xl text-center">
        <h1 className="text-2xl font-bold text-blue-600">Choose Account Type</h1>
        <p className="text-sm text-gray-800">Are you looking to attend events or create events?</p>
        <div className="flex flex-row justify-center gap-11 m-6 ">
          <Button
            onClick={ handleAttendeeRegistration }
            className="flex flex-col items-center justify-center w-25 h-25 bg-orange-500 hover:bg-green-600 text-white shadow-lg"
          >
            <Icon icon="mdi:account" className="text-3xl" />
            <span className="mt-1 px-1 text-sm">Attend Events</span> {/* Centered text below the icon */ }
          </Button>
          <Button
            onClick={ handleOrganizationRegistration }
            className="flex flex-col items-center justify-center w-25 h-25 bg-orange-500 hover:bg-green-600 text-white shadow-lg"
          >
            <Icon icon="mdi:office-building" className="text-3xl" />
            <span className="  text-sm">Create Events </span> {/* Centered text below the icon */ }

          </Button>
        </div>
      </div>
    </div>
  );
}
