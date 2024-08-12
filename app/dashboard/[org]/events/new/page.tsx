'use client';

import { useState } from 'react';
import { createClient } from '@utils/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { generateSlug } from '@/utils/stringUtils';
import toast from 'react-hot-toast';
import { createEvent } from '@/app/actions/eventActions';
import ModalBasic from '@/components/modals/ModalBasic';

const CreateEventPage = () =>
{
  const [ name, setName ] = useState( '' );
  const [ description, setDescription ] = useState( '' );
  const [ startDate, setStartDate ] = useState( '' );
  const [ endDate, setEndDate ] = useState( '' );
  const [ venue, setVenue ] = useState( '' );
  const [ address, setAddress ] = useState( '' );
  const [ city, setCity ] = useState( '' );
  const [ state, setState ] = useState( '' );
  const [ country, setCountry ] = useState( '' );
  const [ zipCode, setZipCode ] = useState( '' );
  const [ maxAttendees, setMaxAttendees ] = useState( 0 );
  const [ isModalOpen, setIsModalOpen ] = useState( false );
  const { user } = useUser();
  const [ featuredImage, setFeaturedImage ] = useState<File | null>( null );
  const [ slug, setSlug ] = useState<string | null>( null );

  const handleImageUpload = async ( file: File | null, orgName: string ) =>
  {
    if ( !file )
    {
      console.error( 'No file selected' );
      return null;
    }

    const uniqueFilename = `${ orgName }_${ file.name }`;
    const { data, error } = await createClient().storage
      .from( 'eventFeaturedImages' )
      .upload( `public/${ uniqueFilename }`, file, {
        cacheControl: '3600',
        upsert: false,
      } );

    if ( error )
    {
      console.error( 'Error uploading file:', error.message );
      return null;
    }

    const { data: publicUrlData } = createClient().storage
      .from( 'eventFeaturedImages' )
      .getPublicUrl( `public/${ uniqueFilename }` );

    return publicUrlData?.publicUrl || '';
  };

  const handleSubmit = async ( e: { preventDefault: () => void } ) =>
  {
    e.preventDefault();
    if ( !user ) return;

    const orgId = user.organizationId;

    const imageUrl = await handleImageUpload( featuredImage, user.orgName );
    if ( !imageUrl )
    {
      toast.error( 'Failed to upload the image.' );
      return;
    }

    const generatedSlug = generateSlug( name );
    setSlug( generatedSlug );

    const formData = new FormData();
    formData.append( 'orgId', orgId );
    formData.append( 'name', name );
    formData.append( 'slug', generatedSlug );
    formData.append( 'description', description );
    formData.append( 'startDate', startDate );
    formData.append( 'endDate', endDate );
    formData.append( 'venue', venue );
    formData.append( 'address', address );
    formData.append( 'city', city );
    formData.append( 'state', state );
    formData.append( 'country', country );
    formData.append( 'zipCode', zipCode );
    formData.append( 'maxAttendees', maxAttendees.toString() );
    formData.append( 'status', 'draft' );
    formData.append( 'featuredImage', imageUrl );

    try
    {
      const response = await createEvent( formData );

      if ( response.success )
      {
        toast.success( 'Event created successfully!' );
        setIsModalOpen( true );
        // Clear form
        setName( '' );
        setDescription( '' );
        setStartDate( '' );
        setEndDate( '' );
        setVenue( '' );
        setAddress( '' );
        setCity( '' );
        setState( '' );
        setCountry( '' );
        setZipCode( '' );
        setMaxAttendees( 0 );
        setFeaturedImage( null );
      } else
      {
        toast.error( 'Failed to create event: ' + response.message );
      }
    } catch ( error )
    {
      console.error( 'Error creating event:', error );
      toast.error( 'An unexpected error occurred.' );
    }
  };

  const handleModalClose = () =>
  {
    setIsModalOpen( false );
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Create an Event</h1>
      <form onSubmit={ handleSubmit } className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Event Name
          </label>
          <input
            type="text"
            id="name"
            value={ name }
            onChange={ ( e ) => setName( e.target.value ) }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Event Name"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={ description }
            onChange={ ( e ) => setDescription( e.target.value ) }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Description"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Featured Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={ ( e ) => setFeaturedImage( e.target.files?.[ 0 ] || null ) }
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="datetime-local"
            id="startDate"
            value={ startDate }
            onChange={ ( e ) => setStartDate( e.target.value ) }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="datetime-local"
            id="endDate"
            value={ endDate }
            onChange={ ( e ) => setEndDate( e.target.value ) }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="venue" className="block text-sm font-medium text-gray-700">
            Venue
          </label>
          <input
            type="text"
            id="venue"
            value={ venue }
            onChange={ ( e ) => setVenue( e.target.value ) }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Venue"
            required
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            id="address"
            value={ address }
            onChange={ ( e ) => setAddress( e.target.value ) }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Address"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              id="city"
              value={ city }
              onChange={ ( e ) => setCity( e.target.value ) }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="City"
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">
              State
            </label>
            <input
              type="text"
              id="state"
              value={ state }
              onChange={ ( e ) => setState( e.target.value ) }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="State"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <input
              type="text"
              id="country"
              value={ country }
              onChange={ ( e ) => setCountry( e.target.value ) }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Country"
            />
          </div>

          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
              Zip Code
            </label>
            <input
              type="text"
              id="zipCode"
              value={ zipCode }
              onChange={ ( e ) => setZipCode( e.target.value ) }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Zip Code"
            />
          </div>
        </div>

        <div>
          <label htmlFor="maxAttendees" className="block text-sm font-medium text-gray-700">
            Max Attendees
          </label>
          <input
            type="number"
            id="maxAttendees"
            value={ maxAttendees }
            onChange={ ( e ) => setMaxAttendees( Number( e.target.value ) ) }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Max Attendees"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Event
          </button>
        </div>
      </form>
      <ModalBasic
        isOpen={ isModalOpen }
        onClose={ handleModalClose }
        user={ user }
        slug={ slug as string }
      />
    </div>
  );
};

export default CreateEventPage;
