'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext'; // Replace with your actual user context if needed

import LogoSpinner from '@/components/Loaders/LogoSpinner';
import { Button } from '@nextui-org/button'; // Import NextUI components
import
{
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from "@nextui-org/modal";
import React from 'react';
import { archiveForm, deleteForm, getForms } from '@/app/actions/formActions';
import { Badge } from '@/components/ui/badge';

interface Form
{
  id: string;
  form_name: string;
  status: string; 
  description: string | null;
  isArchived: boolean;
  isDeleted: boolean;
  isDraft: boolean;
}

export default function FormsPage ()
{
  const { user } = useUser(); // Assuming useUser is fetching organization details
  const [ forms, setForms ] = useState<Form[]>( [] );
  const [ loading, setLoading ] = useState( true );
  const [ error, setError ] = useState<string | null>( null );

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [ selectedFormId, setSelectedFormId ] = useState<string | null>( null );

  
  useEffect( () =>
  {
    async function fetchForms ()
    {
      if ( !user?.organizationId )
      {
        setError( 'Organization not found' );
        setLoading( false );
        return;
      }

      try
      {
        setLoading( true );
        const formsData = await getForms( user.organizationId ); // Call the server action
        setForms( formsData );
      } catch ( error )
      {
        console.error( 'Failed to fetch forms:', error );
        setError( 'Failed to fetch forms' );
      } finally
      {
        setLoading( false );
      }
    }

    fetchForms();
  }, [ user?.organizationId ] );

 
 
// Labels for the status badge
  const renderStatusLabel = ( form: Form ) =>
  {
    if ( form.isDraft )
    {
      return <Badge className='bg-red-500'>Draft</Badge>;
    }
    if ( form.isArchived || form.status === 'archived' )
    {
      return <Badge className='bg-yellow-400'>Archived</Badge>;
    }
    return <Badge className='bg-green-500'>Active</Badge>;
  };

// Archive form handler
  const handleArchive = async ( formId: string ) =>
  {
    if ( confirm( 'Are you sure you want to archive this form?' ) )
    {
      try
      {
        await archiveForm( formId, user?.organizationId || '' ); // Call the server action here
       
        // Update the specific form's status to "archived" in the local state
        setForms( forms.map( ( form ) =>
          form.id === formId
            ? { ...form, isArchived: true, status: 'archived' }
            : form
        ) );

      } catch ( error )
      {
        console.error( 'Failed to archive form:', error );
        setError( 'Failed to archive form' );
      }
    }
  };
  const openModal = ( formId: string ) =>
  {
    setSelectedFormId( formId );
    onOpen(); // Open the modal
  };

  const confirmArchive = () =>
  {
    if ( selectedFormId )
    {
      handleArchive( selectedFormId ); // Call the archive handler
    }
    onOpenChange(); // Close the modal
  };


  if ( loading )
  {
    return (
      <div className="flex justify-center items-center h-screen">
        <LogoSpinner />
      </div>
    );
  }

  if ( error )
  {
    return <p className="text-red-600 text-center">{ error }</p>;
  }

  return (
    <>
      <div className="sm:px-6 p-6 rounded-2xl bg-white">
        <h1 className="text-2xl font-semibold mb-4">All Forms</h1>
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <p className="mt-2 text-sm text-gray-700">
              A list of all forms in your organization including their name and description.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Link href={ `/dashboard/${ user?.organizationId }/forms/new` }>
              <div className="block rounded-3xl bg-blue-700 px-3 py-2 text-center text-lg font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600">
                Add New Form
              </div>
            </Link>
          </div>
        </div>

        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50 hidden md:table-header-group">
                    <tr>
                      <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Form Name</th>
                      <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
                      <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    { forms.length > 0 ? (
                      forms.map( ( form ) => (
                        <tr key={ form.id }>
                          <td className="px-3 py-2">{ form.form_name }</td>
                          <td className="px-3 py-2">{ form.description || 'No description' }</td>
                          <td className="px-3 py-2">
                            { renderStatusLabel( form ) } {/* Render the status badge */ }
                          </td>
                          <td className="px-3 py-2">
                            <Link href={ `/dashboard/${ user?.organizationId }/forms/${ form.id }` }>
                              <span className="text-blue-600 hover:text-blue-900 cursor-pointer">
                                Edit
                              </span>
                            </Link>
                            <Link href={ `/forms/${ user?.organizationId }/${ form.id }` }>
                              <span className="text-blue-600 hover:text-blue-900 cursor-pointer ml-4">
                                View Form
                              </span>
                            </Link>
                            <button
                              onClick={ () => openModal( form.id ) }
                              className="text-red-600 hover:text-red-900 cursor-pointer ml-4"
                            >
                              Archive
                            </button>
                          </td>
                        </tr>
                      ) )
                    ) : (
                      <tr>
                        <td colSpan={ 4 } className="px-3 py-2 text-center text-sm text-gray-500">
                          No forms found.
                        </td>
                      </tr>
                    ) }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for delete confirmation */ }
      <Modal isOpen={ isOpen } onOpenChange={ onOpenChange }>
        <ModalContent>
          { onClose => (
            <>
              <ModalHeader>Confirm Archive</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to Archive this form? </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={ confirmArchive }>
                  Yes, Archive
                </Button>
                <Button color="primary" onPress={ onClose }>
                  Cancel
                </Button>
              </ModalFooter>
            </>
          ) }
        </ModalContent>
      </Modal>
    </>
  );
}
