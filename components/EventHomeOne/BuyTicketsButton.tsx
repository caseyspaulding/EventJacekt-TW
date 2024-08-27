

import React from 'react';

import { Button } from '@nextui-org/button';

interface BuyTicketsButtonProps
{
  eventSlug: string;
}

const BuyTicketsButton: React.FC<BuyTicketsButtonProps> = ( { eventSlug } ) =>
{
 


  return (
    <>
      {/* Button for large screens */ }
      <div className="hidden lg:flex justify-center mt-8">
        <Button
          as='a'
          href = { `/events/${ eventSlug }/tickets` }
          className=""
          color='warning'
        >
          Get Tickets
        </Button>
      </div>

      {/* Sticky footer button for small screens */ }
      <div className="lg:hidden z-50 fixed bottom-0 left-0 right-0 bg-white shadow-md p-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">$30 - $550</span> {/* Price range or any relevant info */ }
          <Button
            as="a"
            href = { `/events/${ eventSlug }/tickets` }
            className=""
          >
            Get Tickets
          </Button>
        </div>
      </div>
    </>
  );
};

export default BuyTicketsButton;
