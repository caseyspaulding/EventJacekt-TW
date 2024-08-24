"use client";

import React from "react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { registerTicketBuyer } from "./registerTicketBuyer"; // Server action for registering ticket buyer
import { Icon } from "@iconify/react";

export default function ChooseAccountType ()
{
  const router = useRouter();

  const handleAttendeeRegistration = async () =>
  {
    // Call server action to create ticket buyer profile
    const result = await registerTicketBuyer();

    if ( result.success )
    {
      // Redirect to the ticket buyer's dashboard
      router.push( `/${ result.userId }/dashboard` );
    } else
    {
      console.error( result.message );
    }
  };

  const handleOrganizationRegistration = () =>
  {
    router.push( "/register-organization" ); // Assuming you have a separate page for organization registration
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-r from-gray-100 via-blue-100 to-gray-100 px-4">
      <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small text-center">
        <h1 className="text-2xl font-bold text-blue-600">Choose Account Type</h1>
        <p className="text-sm text-gray-800">Please select the type of account you want to create:</p>
        <div className="flex flex-row justify-center gap-6 mt-6">
          <Button
            onClick={ handleAttendeeRegistration }
            className="flex flex-col items-center justify-center w-24 h-24 bg-green-500 hover:bg-green-600 text-white shadow-lg"
          >
            <Icon icon="mdi:account" className="text-3xl" />
            <span className="text-sm">Attendee</span>
          </Button>
          <Button
            onClick={ handleOrganizationRegistration }
            className="flex flex-col items-center justify-center w-24 h-24 bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
          >
            <Icon icon="mdi:office-building" className="text-3xl" />
            <span className="text-sm">Organization</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
