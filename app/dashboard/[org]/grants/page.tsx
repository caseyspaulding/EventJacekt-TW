'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';

import BreadcrumbsPageHeader from '../components/BreadcrumbsPageHeading';
import LogoSpinner from '@/components/Loaders/LogoSpinner';
import { Button } from '@nextui-org/react'; // Import NextUI components
import
  {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure
  } from "@nextui-org/modal";
import { deleteGrant, getGrantsByOrg, getUserAndOrgId } from '@/app/actions/grantActions';

interface Grant
{
  id: string;
  grantName: string;
  applicantOrganization: string;
  status: string;
  amountRequested: number; // Ensure this is a number
  amountApproved: number | null; // This can be null or a number
  deadline: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export default function GrantsPage ()
{
  const { user } = useUser();
  const [ grants, setGrants ] = useState<Grant[]>( [] );
  const [ loading, setLoading ] = useState( true );
  const [ error, setError ] = useState<string | null>( null );
  const [ selectedGrantId, setSelectedGrantId ] = useState<string | null>( null ); // Selected grant for deletion
  const { isOpen, onOpen, onOpenChange } = useDisclosure(); // Use NextUI's useDisclosure hook

  useEffect( () =>
  {
    async function fetchGrants ()
    {
      try
      {
        setLoading( true ); // Set loading state

        // Fetch user and orgId using utility function
        const { orgId } = await getUserAndOrgId();

        if ( !orgId )
        {
          setError( 'Organization not found' );
          setLoading( false );
          return;
        }

        // Fetch grants using the organization ID
        const fetchedGrants = await getGrantsByOrg( orgId );

        // Ensure that numeric fields are parsed as numbers
        const parsedGrants = fetchedGrants.map( ( grant ) => ( {
          ...grant,
          amountRequested: grant.amountRequested ? parseFloat( grant.amountRequested ) : 0, // Ensure numeric format or fallback to 0
          amountApproved: grant.amountApproved ? parseFloat( grant.amountApproved ) : null, // Optional field
        } ) );

        setGrants( parsedGrants ); // Set parsed grants to state
      } catch ( error )
      {
        console.error( 'Failed to fetch grants:', error );
        setError( 'Failed to fetch grants' );
      } finally
      {
        setLoading( false ); // Ensure loading state is reset
      }
    }

    fetchGrants();
  }, [] ); 

  const handleDelete = async ( grantId: string ) =>
  {
    if ( confirm( 'Are you sure you want to delete this grant?' ) )
    {
      try
      {
        const response = await deleteGrant( grantId ); // Call the updated server action

        if ( response.success )
        {
          setGrants( grants.filter( ( grant ) => grant.id !== grantId ) );
        } else
        {
          setError( response.error || 'Failed to delete grant' );
        }
      } catch ( error )
      {
        console.error( 'Failed to delete grant:', error );
        setError( 'Failed to delete grant' );
      }
    }
  };

  if ( loading )
  {
    return (
      <div style={ {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      } }>
        <LogoSpinner />
      </div>
    );
  }

  if ( error )
  {
    return <p className="text-red-600">{ error }</p>;
  }

  const breadcrumbs = [
    { name: 'Dashboard', href: '/' },
    { name: 'All Grants', href: '/grants', current: true },
  ];

  const openModal = ( grantId: string ) =>
  {
    setSelectedGrantId( grantId );
    onOpen();
  };

  const confirmDelete = () =>
  {
    if ( selectedGrantId )
    {
      handleDelete( selectedGrantId );
    }
    onOpenChange(); // Close the modal
  };

  return (
    <>
      <div className="sm:px-6 p-6 rounded-2xl bg-white">
        <BreadcrumbsPageHeader title="All Grants" breadcrumbs={ breadcrumbs } />
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <p className="mt-2 text-sm text-gray-700">
              A list of all grants for your organization including their name, applicant organization, amount requested, and status.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Link href={ `/dashboard/${ user?.orgName }/grants/new` }>
              <div className="block rounded-3xl bg-yellow-500 px-3 py-2 text-center text-lg font-semibold text-white shadow-sm hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600">
                Add New Grant
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
                      <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Grant Name</th>
                      <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Applicant Organization</th>
                      <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Amount Requested</th>
                      <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    { grants.length > 0 ? (
                      grants.map( ( grant ) => (
                        <tr key={ grant.id } className="block md:table-row md:border-none md:shadow-none mb-4 md:mb-0">
                          <td className="block md:table-cell px-3 py-2">
                            <strong className="md:hidden">Grant Name: </strong>
                            { grant.grantName }
                          </td>
                          <td className="block md:table-cell px-3 py-2">
                            <strong className="md:hidden">Applicant Organization: </strong>
                            { grant.applicantOrganization }
                          </td>
                          <td className="block md:table-cell px-3 py-2">
                            <strong className="md:hidden">Amount Requested: </strong>
                            ${ grant.amountRequested }
                          </td>
                          <td className="block md:table-cell px-3 py-2">
                            <strong className="md:hidden">Status: </strong>
                            { grant.status }
                          </td>
                          <td className="block md:table-cell px-3 py-2">
                            {/* Edit Grant */ }
                            <Link href={ `/dashboard/${ user?.orgName }/grants/${ grant.id }/edit` }>
                              <div className="text-blue-600 hover:text-blue-900 cursor-pointer">
                                Edit
                              </div>
                            </Link>

                            {/* Delete Grant */ }
                            <button
                              onClick={ () => openModal( grant.id ) }
                              className="text-red-600 hover:text-red-900 cursor-pointer mt-2"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ) )
                    ) : (
                      <tr>
                        <td colSpan={ 5 } className="px-3 py-2 text-center text-sm text-gray-500">
                          No grants found.
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
          { ( onClose ) => (
            <>
              <ModalHeader>Confirm Deletion</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete this grant? This action cannot be undone.</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={ confirmDelete }>
                  Yes, Delete
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
