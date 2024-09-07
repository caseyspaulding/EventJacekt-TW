'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { getEventBySlug, updateEvent } from '@/app/actions/eventActions';
import toast from 'react-hot-toast';
import { Button, Input, Textarea } from '@nextui-org/react';

import { createClient } from '@utils/supabase/client'; // For Supabase bucket storage
import { FileUploadButton } from '../../new/FileUploadButton';
import { ImageUploadVenue } from '../../new/ImageUploadVenue';

const EditEventPage = () =>
{
  const [ eventData, setEventData ] = useState( {
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    venue: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    maxAttendees: 0,
    featuredImage: '',
    venueImage: '', // New field for venue image
  } );

  const [ eventId, setEventId ] = useState<string | null>( null );
  const [ previewImage, setPreviewImage ] = useState<string | null>( null ); // Preview for the featured image
  const [ venueImagePreview, setVenueImagePreview ] = useState<string | null>( null ); // Preview for the venue image
  const [ featuredImageFile, setFeaturedImageFile ] = useState<File | null>( null ); // File for the featured image
  const [ venueImageFile, setVenueImageFile ] = useState<File | null>( null ); // File for the venue image
  const { user } = useUser();
  const { eventSlug } = useParams();
  const slug = Array.isArray( eventSlug ) ? eventSlug[ 0 ] : eventSlug;

  useEffect( () =>
  {
    async function fetchEventDetails ()
    {
      if ( eventSlug )
      {
        try
        {
          const data = await getEventBySlug( slug as string );
          setEventData( {
            name: data.name || '',
            description: data.description || '',
            startDate: data.startDate ? new Date( data.startDate ).toISOString().split( 'T' )[ 0 ] : '',
            endDate: data.endDate ? new Date( data.endDate ).toISOString().split( 'T' )[ 0 ] : '',
            venue: data.venue || '',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            country: data.country || '',
            zipCode: data.zipCode || '',
            maxAttendees: data.maxAttendees ?? 0,
            featuredImage: data.featuredImage || '',
            venueImage: data.venueImage || '', // Load existing venue image
          } );

          // Store eventId for later use
          setEventId( data.id );

          // Set preview images if they exist
          if ( data.featuredImage ) setPreviewImage( data.featuredImage );
          if ( data.venueImage ) setVenueImagePreview( data.venueImage );
        } catch ( error )
        {
          console.error( 'Error fetching event details:', error );
          toast.error( 'Failed to fetch event details.' );
        }
      }
    }

    fetchEventDetails();
  }, [ eventSlug ] );

  const handleInputChange = ( e: { target: { name: string; value: string } } ) =>
  {
    const { name, value } = e.target;
    setEventData( { ...eventData, [ name ]: value } );
  };

  const handleImageUpload = async ( file: File | null, orgName: string, bucketName: string ) =>
  {
    if ( !file ) return null;

    const uniqueFilename = `${ orgName }_${ Date.now() }_${ file.name }`;
    const { error } = await createClient()
      .storage.from( bucketName )
      .upload( `public/${ uniqueFilename }`, file, {
        cacheControl: '3600',
        upsert: false,
      } );

    if ( error )
    {
      console.error( 'Error uploading file:', error.message );
      return null;
    }

    const { data: publicUrlData } = createClient()
      .storage.from( bucketName )
      .getPublicUrl( `public/${ uniqueFilename }` );

    return publicUrlData?.publicUrl || '';
  };

  const handleSubmit = async ( e: { preventDefault: () => void } ) =>
  {
    e.preventDefault();
    if ( !user ) return;

    if ( !eventId )
    {
      toast.error( 'Event ID is missing. Cannot update event.' );
      return;
    }

    // Upload featured image if updated
    const featuredImageUrl = featuredImageFile
      ? await handleImageUpload( featuredImageFile, user.orgName, 'eventFeaturedImages' )
      : eventData.featuredImage;

    // Upload venue image if updated
    const venueImageUrl = venueImageFile
      ? await handleImageUpload( venueImageFile, user.orgName, 'venueImages' )
      : eventData.venueImage;

    const formData = new FormData();
    formData.append( 'name', eventData.name );
    formData.append( 'description', eventData.description );
    formData.append( 'startDate', eventData.startDate );
    formData.append( 'endDate', eventData.endDate );
    formData.append( 'venue', eventData.venue );
    formData.append( 'address', eventData.address );
    formData.append( 'city', eventData.city );
    formData.append( 'state', eventData.state );
    formData.append( 'country', eventData.country );
    formData.append( 'zipCode', eventData.zipCode );
    formData.append( 'maxAttendees', eventData.maxAttendees.toString() );

    if ( featuredImageUrl ) formData.append( 'featuredImage', featuredImageUrl );
    if ( venueImageUrl ) formData.append( 'venueImage', venueImageUrl );

    try
    {
      const response = await updateEvent( eventId, formData );
      if ( response )
      {
        toast.success( 'Event updated successfully!' );
      } else
      {
        toast.error( 'Failed to update event.' );
      }
    } catch ( error )
    {
      console.error( 'Error updating event:', error );
      toast.error( 'An unexpected error occurred.' );
    }
  };

  return (
    <div className="container mx-auto max-w-3xl bg-white p-8 rounded-lg">
      <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">Edit Event</h1>

      <form onSubmit={ handleSubmit } className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Event Name</label>
          <Input
            type="text"
            name="name"
            value={ eventData.name }
            onChange={ handleInputChange }
            placeholder="Event Name"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <Textarea
            name="description"
            value={ eventData.description }
            onChange={ handleInputChange }
            placeholder="Description"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        {/* Featured Image Upload */ }
        <div>
          <label className="block text-sm font-medium text-gray-700">Featured Image</label>
          <FileUploadButton
            setImage={ setFeaturedImageFile }
            previewImage={ previewImage }
            setPreviewImage={ setPreviewImage }
            label="Upload Featured Image"
            orgName={ user?.orgName || '' }
          />
        </div>

        {/* Venue Image Upload */ }
        <div>
          <label className="block text-sm font-medium text-gray-700">Venue Image</label>
          <ImageUploadVenue
            setImage={ setVenueImageFile }
            previewImage={ venueImagePreview }
            setPreviewImage={ setVenueImagePreview }
            label="Upload Venue Image"
          />
        </div>

        {/* Other form fields for event details like start date, end date, venue, etc. */ }
        <Button
          type="submit"
          color="warning"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Update Event
        </Button>
      </form>
    </div>
  );
};

export default EditEventPage;
