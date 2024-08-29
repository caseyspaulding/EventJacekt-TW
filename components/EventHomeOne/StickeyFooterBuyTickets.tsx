'use client';

import React from 'react';
import { Button } from '@nextui-org/button';

interface StickyFooterBuyTicketsProps
{
  eventSlug: string;
  priceRange: string;
}

const StickyFooterBuyTickets: React.FC<StickyFooterBuyTicketsProps> = ( { eventSlug, priceRange } ) =>
{
  return (
    <>
      {/* Sticky footer button for small screens */ }
      <div className="lg:hidden z-50 fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-md shadow-md p-2 border-t border-gray-200">
        <div className="flex flex-col justify-center items-center">
          <Button
            as="a"
            href={ `/events/${ eventSlug }/tickets` }
            className="px-2 py-1 bg-orange-500 text-white font-semibold rounded-2xl hover:bg-orange-700 transition-colors w-full"
            
          >
            Get Your Tickets
          </Button>
          <span className="mt-2 text-lg font-semibold">${ priceRange }</span> {/* Price range below the button */ }
        </div>
      </div>
    </>
  );
};

export default StickyFooterBuyTickets;
