import { Button } from 'flowbite-react';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const ModalBasic = ( { isOpen, onClose, user, slug }:
  { isOpen: boolean; onClose: () => void; user: any; slug: string } ) =>
{

  const [ isModalOpen, setIsModalOpen ] = useState( isOpen );

  useEffect( () =>
  {
    setIsModalOpen( isOpen );
  }, [ isOpen ] );

  const handleClose = () =>
  {
    setIsModalOpen( false );
    onClose();
  };

  console.log( 'User:', user ); // Debugging user
  console.log( 'Slug:', slug ); // Debugging slug
  
  if ( !isModalOpen ) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4">Create Tickets</h2>
        <p>Would you like to create tickets for this event now?</p>
        <div className="mt-4 flex justify-end space-x-4">
          <button onClick={ handleClose } className="px-4 py-2 bg-gray-500 text-white rounded-lg">
            No, Thanks
          </button>
          <Link href={ `/dashboard/${ encodeURIComponent( user?.orgName ?? '' ) }/events/${ slug }/create-tickets` } passHref>
            <Button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              Yes, Create Tickets
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ModalBasic;
