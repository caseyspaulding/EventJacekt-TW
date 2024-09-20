export default function page() {
  return (
    <div>page</div>
  )
}

//'use client';

//import { useState, useEffect } from 'react';
//import Link from 'next/link';
//import { useUser } from '@/contexts/UserContext';

//import BreadcrumbsPageHeader from '../components/BreadcrumbsPageHeading';
//import LogoSpinner from '@/components/Loaders/LogoSpinner';
//import { Button } from '@nextui-org/react'; // Import NextUI components
//import
//  {
//    Modal,
//    ModalContent,
//    ModalHeader,
//    ModalBody,
//    ModalFooter,
//    useDisclosure,
//  } from "@nextui-org/modal";
//import { deleteVolunteer, getVolunteersForOrg } from '@/app/actions/VolunteerActions';

//interface Volunteer
//{
//  id: string;
//  email: string;
//  name: string;
//  role: string;
//  createdAt: Date | null;
//  updatedAt: Date | null;
//  status: string | null;
//  orgId: string;
//  notes: string | null;
//  eventId: string;
//  phone?: string | null; // Allow phone to be string or null
//  waiverSigned: boolean | null;
//}

//export default function VolunteersPage ()
//{
//  const { user } = useUser();
//  const [ volunteers, setVolunteers ] = useState<Volunteer[]>( [] );
//  const [ loading, setLoading ] = useState( true );
//  const [ error, setError ] = useState<string | null>( null );
//  const [ selectedVolunteerId, setSelectedVolunteerId ] = useState<string | null>( null );
//  const { isOpen, onOpen, onOpenChange } = useDisclosure();

//  useEffect( () =>
//  {
//    async function fetchVolunteers ()
//    {
//      if ( !user?.orgName )
//      {
//        setError( 'Organization not found' );
//        setLoading( false );
//        return;
//      }

//      try
//      {
//        setLoading( true );
//        const fetchedVolunteers = await getVolunteersForOrg( user.orgName );
//        setVolunteers( fetchedVolunteers );
//      } catch ( error )
//      {
//        console.error( 'Failed to fetch volunteers:', error );
//        setError( 'Failed to fetch volunteers' );
//      } finally
//      {
//        setLoading( false );
//      }
//    }

//    fetchVolunteers();
//  }, [ user?.orgName ] );


//  const breadcrumbs = [
//    { name: 'Dashboard', href: '/' },
//    { name: 'All Volunteers', href: '/volunteers', current: true },
//  ];

//  return (
//    <>
//      <div className="sm:px-6 p-6 rounded-2xl bg-white">
//        <BreadcrumbsPageHeader title="All Volunteers" breadcrumbs={ breadcrumbs } />
//        <div className="sm:flex sm:items-center">
//          <div className="sm:flex-auto">
//            <p className="mt-2 text-sm text-gray-700">
//              A list of all the volunteers in your organization, including their name, role, and status.
//            </p>
//          </div>
//          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
//            <Link href={ `/dashboard/${ user?.orgName }/volunteers/new` }>
//              <div className="block rounded-3xl bg-yellow-500 px-3 py-2 text-center text-lg font-semibold text-white shadow-sm hover:bg-yellow-400">
//                Add New Volunteer
//              </div>
//            </Link>
//          </div>
//        </div>

//        <div className="mt-8 flow-root">
//          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
//            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
//              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
//                <table className="min-w-full divide-y divide-gray-300">
//                  <thead className="bg-gray-50 hidden md:table-header-group">
//                    <tr>
//                      <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
//                      <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
//                      <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
//                      <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
//                    </tr>
//                  </thead>
//                  <tbody className="bg-white divide-y divide-gray-200">
//                    { volunteers.length > 0 ? (
//                      volunteers.map( ( volunteer ) => (
//                        <tr key={ volunteer.id } className="block md:table-row">
//                          <td className="block md:table-cell px-3 py-2">
//                            { volunteer.name }
//                          </td>
//                          <td className="block md:table-cell px-3 py-2">
//                            { volunteer.role }
//                          </td>
//                          <td className="block md:table-cell px-3 py-2">
//                            { volunteer.status }
//                          </td>
//                          <td className="block md:table-cell px-3 py-2">
//                            <Link href={ `/dashboard/${ user?.orgName }/volunteers/${ volunteer.id }/edit` }>
//                              <div className="text-blue-600 hover:text-blue-900 cursor-pointer">
//                                Edit
//                              </div>
//                            </Link>
//                            <button
//                              onClick={ () => openModal( volunteer.id ) }
//                              className="text-red-600 hover:text-red-900 cursor-pointer mt-2"
//                            >
//                              Delete
//                            </button>
//                          </td>
//                        </tr>
//                      ) )
//                    ) : (
//                      <tr>
//                        <td colSpan={ 4 } className="px-3 py-2 text-center text-sm text-gray-500">
//                          No volunteers found.
//                        </td>
//                      </tr>
//                    ) }
//                  </tbody>
//                </table>
//              </div>
//            </div>
//          </div>
//        </div>
//      </div>

//      {/* Modal for delete confirmation */ }
//      <Modal isOpen={ isOpen } onOpenChange={ onOpenChange }>
//        <ModalContent>
//          { ( onClose ) => (
//            <>
//              <ModalHeader>Confirm Deletion</ModalHeader>
//              <ModalBody>
//                <p>Are you sure you want to delete this volunteer? This action cannot be undone.</p>
//              </ModalBody>
//              <ModalFooter>
//                <Button color="danger" variant="light" onPress={ confirmDelete }>
//                  Yes, Delete
//                </Button>
//                <Button color="primary" onPress={ onClose }>
//                  Cancel
//                </Button>
//              </ModalFooter>
//            </>
//          ) }
//        </ModalContent>
//      </Modal>
//    </>
//  );
//}
