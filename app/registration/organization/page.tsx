'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { registerOrganization } from './registerOrganization'; // Update with correct path
import { Button, Input } from '@nextui-org/react';
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const RegisterOrganizationPage = () =>
{
  const router = useRouter();

  const handleSubmit = async ( event: React.FormEvent<HTMLFormElement> ) =>
  {
    event.preventDefault();
    const formData = new FormData( event.currentTarget );

    const result = await registerOrganization( formData );

    if ( result.success )
    {
      // Redirect to the organization's dashboard using dynamic routing
      router.push( `/dashboard/${ result.orgName }` );
    } else
    {
      console.error( result.message );
    }
  };

  return (
    <div className="pt-8 flex min-h-screen items-center justify-center bg-gray-100">
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
        <div className="px-4 sm:px-0">
          <img src='/images/logo.svg' alt='EventJacket' className="h-12 w-auto" /> 
          <h2 className="text-base font-semibold leading-7 text-gray-900">Organization Registration</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Please provide the details of your organization to complete the registration.
          </p>
        </div>

        <form
          onSubmit={ handleSubmit }
          className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
        >
          <div className="px-4 py-6 sm:p-8 ">
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 ">
              <div className="sm:col-span-4">
                <label htmlFor="orgName" className="block text-sm font-medium leading-6 text-gray-900">
                  Organization Name
                </label>
                <div className="mt-2">
                  <Input
                    id="orgName"
                    name="orgName"
                    type="text" 
                    required
                    placeholder=" Enter your organization name"
                
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="website" className="block text-sm font-medium leading-6 text-gray-900">
                  Website
                </label>
                <div className="mt-2">
                  <div className="">
                   
                    <Input
                      id="website"
                      name="website"
                      type="text"
                      placeholder="www.example.com"
                     
                    />
                  </div>
                </div>
              </div>

              {/* Additional fields can be added here as needed */ }

              
              <div className="col-span-full">
                <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
                  Organization Logo
                </label>
                <div className="mt-2 flex items-center gap-x-3">
                  <UserCircleIcon aria-hidden="true" className="h-12 w-12 text-gray-300" />
                  <button
                    type="button"
                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Change
                  </button>
                </div>
              </div>

              
            </div>
          </div>
          <div className="flex items-center justify-start gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
            
            <button
              type="submit"
              className="rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Complete Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterOrganizationPage;
