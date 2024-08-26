'use client';

import React, { useRef, useEffect } from 'react';
import Countdown from './Countdown';
import
  {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Divider,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure
  } from '@nextui-org/react';
import TicketPurchaseClient from '@/app/events/[eventSlug]/TicketPurchaseClient';

interface Ticket
{
  id: string;
  eventId: string;
  orgId: string;
  name: string;
  description: string | null;
  price: string;
  quantity: number;
  eventDate: string;
  saleStartDate: string;
  saleEndDate: string;
  isEarlyBird: boolean | null;
  maxPerCustomer: number | null;
  isFree: boolean | null;
  category: string;
  promoCodeRequired: boolean | null;
  availableOnline: boolean | null;
  groupDiscountAvailable: boolean | null;
  refundable: boolean | null;
  currency: string;
  salesLimitPerDay: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface MainBannerProps
{
  eventName: string;
  eventSubtitle: string;
  eventDate: string;
  location: string;
  bannerImages: string[];
  startDate: string;
  tickets: Ticket[];
  eventSlug: string;
}

const MainBanner2: React.FC<MainBannerProps> = ( {
  eventName,
  eventSubtitle,
  eventDate,
  location,
  startDate,
  tickets,
  eventSlug,
} ) =>
{
  const { isOpen, onOpen, onClose } = useDisclosure();
  const firstInputRef = useRef<HTMLInputElement | null>( null );

  const handleBuyTicketsClick = () =>
  {
    onOpen(); // Open the modal
  };

  useEffect( () =>
  {
    if ( isOpen && firstInputRef.current )
    {
      firstInputRef.current.focus();
    }
  }, [ isOpen ] );

  return (
    <div className="p-4">
      {/* Two-column Layout */ }
      <div className="relative max-w-screen-xl mx-auto flex flex-col lg:grid lg:grid-cols-[3fr_1fr] lg:gap-8">
        {/* Left Column: Event Information */ }
        <div className="flex flex-col justify-top rounded-md px-8 mb-8 lg:mb-0">
          <div className="">
            <h1 className="text-3xl md:text-5xl pt-4 font-bold text-grey-900 mb-4 text-center lg:text-left">
              { eventName } <br />
              <span className="text-xl sm:text-2xl md:text-3xl">{ eventSubtitle }</span>
            </h1>
            <ul className="mb-6 text-center lg:text-left">
              <li className="text-grey-900 text-lg">
                <i className="icofont-compass"></i> { location }
              </li>
              <li className="text-grey-900 text-lg">
                <i className="icofont-calendar"></i> { eventDate }
              </li>
            </ul>
            <div className="flex justify-center lg:justify-start">
              <Countdown startDate={ startDate } />
            </div>
          </div>
        </div>

        {/* Right Column: Tickets Card */ }
        <div className="flex flex-col items-center lg:items-start p-9">
          <h2 className="mb-4 mt-4 text-2xl text-center justify-center font-semibold text-grey-900 ">
            {/* Available Tickets */ }
          </h2>
          <Button
            className="hidden lg:block w-full max-w-[300px] rounded-md bg-orange-600 text-white font-semibold py-2"
            onClick={ handleBuyTicketsClick }
          >
            View and Buy Tickets
          </Button>
        </div>
      </div>

      {/* Sticky Footer for Small Screens */ }
      <div className="fixed bottom-0 left-0 z-49 right-0 bg-white shadow-2xl p-4 flex justify-center items-center lg:hidden">
        <Button
          className="w-full max-w-[300px] rounded-md bg-orange-600 text-white font-semibold py-2 "
          onClick={ handleBuyTicketsClick }
        >
          View and Buy Tickets
        </Button>
      </div>

      {/* Modal for Ticket Purchase */ }
      <Modal size="full" isOpen={ isOpen } onClose={ onClose }>
        <ModalContent>
          { ( onClose ) => (
            <>
              <ModalHeader className="flex flex-col text-center gap-1">Available Tickets</ModalHeader>
              <ModalBody>
                { tickets.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex justify-center">
                      <Countdown startDate={ startDate } />
                    </div>
                    { tickets.map( ( ticket ) => (
                      <Card
                        shadow="sm"
                        key={ ticket.id }
                        className="border-none text-grey-900 bg-background/20 dark:bg-default-100/50 max-w-[400px] mx-auto"
                      >
                        <CardHeader className="flex flex-col items-center">
                          <h3 className="text-xl text-grey-900 font-medium">{ ticket.name }</h3>
                          <p className="text-small text-grey-900 ">
                            Event Date:{ ' ' }
                            { ticket.eventDate
                              ? new Date( ticket.eventDate ).toLocaleDateString()
                              : 'No date available' }
                          </p>
                        </CardHeader>
                        <Divider />
                        <CardBody className="flex flex-col items-center">
                          <p className="text-grey-900 text-center">{ ticket.description }</p>
                          <p className="text-lg text-grey-900 font-semibold">
                            Price: ${ parseFloat( ticket.price ).toFixed( 2 ) }
                          </p>
                        </CardBody>
                        <Divider />
                        <CardFooter>
                          <TicketPurchaseClient
                            ticket={ ticket }
                            eventSlug={ eventSlug }
                            inputRef={ firstInputRef }  // Pass ref to input field
                          />
                        </CardFooter>
                      </Card>
                    ) ) }
                  </div>
                ) : (
                  <p className="text-red-500">No tickets available for this event.</p>
                ) }
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={ onClose }>
                  Close
                </Button>
              </ModalFooter>
            </>
          ) }
        </ModalContent>
      </Modal>
    </div>
  );
};

export default MainBanner2;
