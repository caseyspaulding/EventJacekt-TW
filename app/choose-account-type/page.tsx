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
            className="flex flex-col items-center justify-center my-4 w-25 h-25 bg-orange-500 hover:bg-orange-600 text-white shadow-lg"
            radius='sm'

          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={ 1.5 } stroke="currentColor" className="size-8 mt-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
            </svg>
            <span className="px-1 mb-3 font-medium text-sm">Attend Events</span>
            
          </Button>
          <Button
            onClick={ handleOrganizationRegistration }
            className="flex flex-col items-center my-4  justify-center w-25 h-25 bg-orange-500 hover:bg-orange-600 text-white shadow-lg"
            radius='sm'
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={ 1.5 } stroke="currentColor" className="size-8 mt-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
            </svg>


            <span className="px-1 font-medium  mb-3 text-sm">Create Events </span> {/* Centered text below the icon */ }

          </Button>
        </div>
      </div>
    </div>
  );
}
