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
      <div className="hidden lg:flex justify-center mt-8 ">
        {/* Container with border and padding for styling */ }
        <div className="border rounded-lg px-16 py-4 bg-white shadow-md max-w-xs text-center">
          {/* Price range display */ }
          <div className="mb-4 text-xl font-semibold text-gray-700">
            ${ priceRange }
          </div>
          {/* Get Tickets button */ }
          <Button
            as='a'
            href={ `/events/${ eventSlug }/tickets` }
            className="w-full py-3 bg-orange-500 text-white font-semibold rounded-3xl hover:bg-orange-600 transition-colors"
          >
            Get Your Tickets
          </Button>
        </div>
      </div>
    </>
  );
};

export default BuyTicketsButton;
