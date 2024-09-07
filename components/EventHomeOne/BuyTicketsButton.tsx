'use client';

import React from 'react';
import { Button } from '@nextui-org/button';

interface BuyTicketsButtonProps
{
  eventSlug: string;
  priceRange: string;
}

const BuyTicketsButton: React.FC<BuyTicketsButtonProps> = ( { eventSlug, priceRange } ) =>
{
  return (
    <>
      {/* Button for large screens */ }
      <div className="hidden lg:flex mt-1 justify-center ml-10 ">
        {/* Container with border and padding for styling */ }
        <div className="border rounded-lg px-20 py-4 bg-white shadow-md max-w-xs text-center">
          {/* Price range display */ }
          <div className="mb-4 text-xl font-semibold text-gray-700">
            ${ priceRange }
          </div>
          {/* Get Tickets button */ }
          <Button
            as='a'
            href={ `/events/${ eventSlug }/tickets` }
            className="w-full py-3  rounded-3xl bg-gradient-orange-to-r hover:bg-gradient-orange-hover-to-r px-4 text-base font-medium text-white shadow-sm "
          >
            Buy Your Tickets
          </Button>
        </div>
      </div>
    </>
  );
};

export default BuyTicketsButton;
