'use client';

import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getEventBySlug, updateEvent } from '@/app/actions/eventActions';
import toast from 'react-hot-toast';
import { Button, Textarea } from '@nextui-org/react';

import { createClient } from '@utils/supabase/client'; // For Supabase bucket storage
import { FileUploadButton } from '../../new/FileUploadButton';
import { ImageUploadVenue } from '../../new/ImageUploadVenue';
import { useUser } from '@/contexts/UserContext';
import InputFieldEJ from '@/components/Input/TagInput';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';

type AgendaItem = {
  id: string;
  title: string;
  startTime: Date | null;
  endTime: Date | null;
  description: string | null;
  hostOrArtist: string | null;
};


type FAQ = {
  question: string;
  answer: string;
};

const EditEventPage = () =>
{
  const router = useRouter();
  const [ name, setName ] = useState( '' );
  const [ description, setDescription ] = useState( '' );
  const [ startDate, setStartDate ] = useState( '' );
  const [ endDate, setEndDate ] = useState( '' );
  const [ eventStartTime, setEventStartTime ] = useState( '' );
  const [ eventEndTime, setEventEndTime ] = useState( '' );
  const [ venue, setVenue ] = useState( '' );
  const [ venueDescription, setVenueDescription ] = useState( '' );
  const [ address, setAddress ] = useState( '' );
  const [ city, setCity ] = useState( '' );
  const [ state, setState ] = useState( '' );
  const [ country, setCountry ] = useState( '' );
  const [ zipCode, setZipCode ] = useState( '' );
  const [ maxAttendees, setMaxAttendees ] = useState( 0 );
  const [ featuredImage, setFeaturedImage ] = useState<File | null>( null );
  const [ venueImage, setVenueImage ] = useState<File | null>( null );
  const [ organizerContact, setOrganizerContact ] = useState( '' );
  const [ notes, setNotes ] = useState( '' );
  const [ scheduleDetails, setScheduleDetails ] = useState( '' );
  const [ refundPolicy, setRefundPolicy ] = useState( '' );
  const [ timezone, setTimezone ] = useState( '' );
  const [ tags, setTags ] = useState<string[]>( [] );
  const [ faqs, setFaqs ] = useState<{ question: string; answer: string }[]>( [ { question: '', answer: '' } ] );
  const [ highlights, setHighlights ] = useState<string[]>( [] );

  const { user } = useUser();
  const [ ageRestriction, setAgeRestriction ] = useState( '' );
  const [ parkingOptions, setParkingOptions ] = useState( '' );
  const [ agendaItems, setAgendaItems ] = useState( [ { title: '', startTime: '', endTime: '', description: '', hostOrArtist: '' } ] );

  const [ previewImage, setPreviewImage ] = useState<string | null>( null );
  const [ venueImagePreview, setVenueImagePreview ] = useState<string | null>( null );
  const [ eventId, setEventId ] = useState<string | null>( null );

  const { eventSlug } = useParams(); // Get event slug from URL
  const slug = Array.isArray( eventSlug ) ? eventSlug[ 0 ] : eventSlug;

  useEffect( () =>
  {
    async function fetchEventDetails ()
    {
      if ( slug )
      {
        try
        {
          const data = await getEventBySlug( slug );

          setName( data.name || '' );
          setDescription( data.description || '' );
          setStartDate( data.startDate ? new Date( data.startDate ).toISOString().split( 'T' )[ 0 ] : '' );
          setEndDate( data.endDate ? new Date( data.endDate ).toISOString().split( 'T' )[ 0 ] : '' );
          setEventStartTime( data.eventStartTime || '' );
          setEventEndTime( data.eventEndTime || '' );
          setVenue( data.venue || '' );
          setVenueDescription( data.venueDescription || '' );
          setAddress( data.address || '' );
          setCity( data.city || '' );
          setState( data.state || '' );
          setCountry( data.country || '' );
          setZipCode( data.zipCode || '' );
          setMaxAttendees( data.maxAttendees || 0 );
          setNotes( data.notes || '' );
          setScheduleDetails( data.scheduleDetails || '' );
          setRefundPolicy( data.refundPolicy || '' );
          setTimezone( data.timezone || '' );
          setTags( data.tags || [] );
          setHighlights( data.highlights || [] );
          setFaqs( Array.isArray( data.faqs ) ? data.faqs : [ { question: '', answer: '' } ] );
          setOrganizerContact( data.organizerContact || '' );
          setAgeRestriction( data.ageRestriction || '' );
          setParkingOptions( data.parkingOptions || '' );
          // Set agendaItems (assuming it comes from the server)
          // Set agenda items, converting Date | null to string
          const formattedAgendaItems = data.agendaItems.map( ( item: AgendaItem ) => ( {
            title: item.title,
            startTime: item.startTime ? new Date( item.startTime ).toISOString() : '',
            endTime: item.endTime ? new Date( item.endTime ).toISOString() : '',
            description: item.description || '',
            hostOrArtist: item.hostOrArtist || '',
          } ) );
          // Set the state for agendaItems
          setAgendaItems( formattedAgendaItems );

          if ( data.featuredImage ) setPreviewImage( data.featuredImage );
          if ( data.venueImage ) setVenueImagePreview( data.venueImage );

          setEventId( data.id );
        } catch ( error )
        {
          console.error( 'Error fetching event details:', error );
          toast.error( 'Failed to fetch event details.' );
        }
      }
    }

    fetchEventDetails();
  }, [ slug ] );


  const handleImageUpload = async ( file: File | null, orgName: string, bucketName: string ) =>
  {
    if ( !file ) return null;

    const uniqueFilename = `${ orgName }_${ Date.now() }_${ file.name }`;
    const { error } = await createClient()
      .storage.from( bucketName )
      .upload( `public/${ uniqueFilename }`, file, { cacheControl: '3600', upsert: false } );

    if ( error )
    {
      console.error( 'Error uploading file:', error.message );
      return null;
    }

    const { data: publicUrlData } = createClient().storage.from( bucketName ).getPublicUrl( `public/${ uniqueFilename }` );
    return publicUrlData?.publicUrl || '';
  };

  const handleSubmit = async ( e: { preventDefault: () => void } ) =>
  {
    e.preventDefault();
    if ( !eventId )
    {
      toast.error( 'Event ID is missing. Cannot update event.' );
      return;
    }

    const featuredImageUrl = featuredImage ? await handleImageUpload( featuredImage, user?.orgName || '', 'eventFeaturedImages' ) : previewImage;
    const venueImageUrl = venueImage ? await handleImageUpload( venueImage, user?.orgName || '', 'venueImages' ) : venueImagePreview;

    const startDateISO = startDate ? new Date( startDate ).toISOString() : null;
    const endDateISO = endDate ? new Date( endDate ).toISOString() : null;

    const formData = new FormData();
    formData.append( 'name', name );
    formData.append( 'description', description );
    formData.append( 'startDate', startDateISO || '' );
    formData.append( 'endDate', endDateISO || '' );
    formData.append( 'eventStartTime', eventStartTime );
    formData.append( 'eventEndTime', eventEndTime );
    formData.append( 'venue', venue );
    formData.append( 'venueDescription', venueDescription );
    formData.append( 'organizerContact', organizerContact );
    formData.append( 'address', address );
    formData.append( 'city', city );
    formData.append( 'state', state );
    formData.append( 'country', country );
    formData.append( 'zipCode', zipCode );
    formData.append( 'maxAttendees', maxAttendees.toString() );
    formData.append( 'notes', notes );
    formData.append( 'scheduleDetails', scheduleDetails );
    formData.append( 'refundPolicy', refundPolicy );
    formData.append( 'timezone', timezone );
    formData.append( 'tags', tags.join( ',' ) ); // Convert array to comma-separated string
    formData.append( 'highlights', highlights.join( ',' ) ); // Convert array to comma-separated string
    formData.append( 'faqs', JSON.stringify( faqs ) );

    formData.append( 'ageRestriction', ageRestriction );
    formData.append( 'parkingOptions', parkingOptions );
    formData.append( 'agendaItems', JSON.stringify( agendaItems ) );

    if ( featuredImageUrl ) formData.append( 'featuredImage', featuredImageUrl );
    if ( venueImageUrl ) formData.append( 'venueImage', venueImageUrl );

    try
    {

      const response = await updateEvent( eventId, formData );

      if ( response.success )
      {
        toast.success( 'Event updated successfully!' );
        // Delay the redirection after showing the toast
        setTimeout( () =>
        {
          router.push( `/dashboard/${ user?.orgName }/events` );
        }, 2000 ); // Delay the redirect by 2 seconds (optional)
      } else
      {
        toast.error( 'Failed to update event: ' + response.message );
      }
    } catch ( error )
    {
      console.error( 'Error updating event:', error );
      toast.error( 'An unexpected error occurred.' );
    }
  };


  const handleAgeRestrictionChange = ( option: string ) =>
  {
    setAgeRestriction( option );
  };


  const handleFaqChange = ( e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, field: keyof FAQ ) =>
  {
    const newFaqs = [ ...faqs ];
    newFaqs[ index ][ field ] = e.target.value; // TypeScript now understands field is a key of FAQ
    setFaqs( newFaqs );
  };
  const handleParkingOptionsChange = ( option: string ) =>
  {
    setParkingOptions( option );
  };

  const addFaq = () =>
  {
    setFaqs( [ ...faqs, { question: '', answer: '' } ] );
  };

  const removeFaq = ( index: number ) =>
  {
    const newFaqs = faqs.filter( ( _, i ) => i !== index );
    setFaqs( newFaqs );
  };
  return (
    <div className="container mx-auto max-w-3xl bg-white p-8 rounded-lg">
      <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">Edit Event</h1>

      <form onSubmit={ handleSubmit } className="space-y-6 pb-24">
        <div>
          <label className="block text-sm mb-3 font-medium text-gray-700">
            Event Featured Image
          </label>
          <FileUploadButton
            setImage={ setFeaturedImage }
            previewImage={ previewImage }
            setPreviewImage={ setPreviewImage }
            label=""
            orgName={ user?.orgName || '' } />


        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Event Name
          </label>
          <Input
            type="text"
            id="name"

            value={ name }
            onChange={ ( e ) => setName( e.target.value ) }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Event Name"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <Input
            id="description"
            value={ description }
            onChange={ ( e ) => setDescription( e.target.value ) }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Description"
          />
        </div>

        <div>
          <label htmlFor="organizerContact" className="block text-sm font-medium text-gray-700">
            Organizer Contact Information
          </label>
          <Input
            type="text"
            id="organizerContact"
            value={ organizerContact }
            onChange={ ( e ) => setOrganizerContact( e.target.value ) }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Organizer Contact Information"

            required
          />
        </div>


        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <Input
            type="date"
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
          <Input
            type="date"
            id="endDate"
            value={ endDate }
            onChange={ ( e ) => setEndDate( e.target.value ) }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required

          />
        </div>


        <div>
          <label htmlFor="eventStartTime" className="block text-sm font-medium text-gray-700">
            Event Start Time
          </label>
          <Input
            type="time"
            id="eventStartTime"
            value={ eventStartTime }
            onChange={ ( e ) => setEventStartTime( e.target.value ) }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required

          />
        </div>
        <div>
          <label htmlFor="eventEndTime" className="block text-sm font-medium text-gray-700">
            Event End Time
          </label>
          <Input
            type="time"
            id="eventEndTime"
            value={ eventEndTime }
            onChange={ ( e ) => setEventEndTime( e.target.value ) }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required

          />
        </div>

        <div>

          <label htmlFor="venue" className="block text-sm font-medium text-gray-700">
            Venue
          </label>

          <Input
            type="text"
            id="venue"
            value={ venue }
            onChange={ ( e ) => setVenue( e.target.value ) }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Venue"
          />
        </div>
        <ImageUploadVenue
          setImage={ setVenueImage }
          previewImage={ venueImagePreview }
          setPreviewImage={ setVenueImagePreview }
          label=""
        />
        <div>
          <Textarea
            id="venueDescription"
            value={ venueDescription }
            onChange={ ( e ) => setVenueDescription( e.target.value ) }
            label="Venue Description"
            placeholder="Describe the venue"
            rows={ 4 } // Adjust the number of visible rows
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>


        <div>


          <Input
            type="text"
            id="address"
            value={ address }
            onChange={ ( e ) => setAddress( e.target.value ) }
            className=" block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Address" />


        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>

            <Input
              type="text"
              id="city"
              value={ city }
              onChange={ ( e ) => setCity( e.target.value ) }
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="City" />
          </div>

          <div>

            <Input
              type="text"
              id="state"
              value={ state }
              onChange={ ( e ) => setState( e.target.value ) }
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="State" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">


          <div>

            <Input
              type="text"
              id="zipCode"
              value={ zipCode }
              onChange={ ( e ) => setZipCode( e.target.value ) }
              className=" block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Zip Code" />
          </div>

        </div>


        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <Input
            id="notes"
            value={ notes }
            onChange={ ( e ) => setNotes( e.target.value ) }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Notes" />
        </div>

        <div>
          <label htmlFor="scheduleDetails" className="block text-sm font-medium text-gray-700">
            Schedule Details
          </label>
          <Textarea
            id="scheduleDetails"
            value={ scheduleDetails }
            onChange={ ( e ) => setScheduleDetails( e.target.value ) }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Details about the schedule, agenda, etc." label={ '' } />
        </div>

        <div>
          <label htmlFor="refundPolicy" className="block text-sm font-medium text-gray-700">
            Refund Policy
          </label>
          <Textarea
            id="refundPolicy"
            value={ refundPolicy }
            onChange={ ( e ) => setRefundPolicy( e.target.value ) }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Refund Policy"
          />
        </div>

        <div>

          <Input
            type="text"
            id="timezone"
            value={ timezone }
            onChange={ ( e ) => setTimezone( e.target.value ) }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Timezone"
          />
        </div>

        <div>

          <Input
            type="text"
            id="tags"
            value={ tags.join( ', ' ) } // Convert array to comma-separated string for display
            onChange={ ( e ) => setTags( e.target.value.split( ',' ).map( tag => tag.trim() ) ) } // Split by commas and trim spaces
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Tags (comma separated)"

          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Frequently Asked Questions</label>
          <p className="text-sm text-gray-500 mb-4">
            Answer questions your attendees may have about the event, like accessibility and amenities.
          </p>
          { faqs.map( ( faq, index ) => (
            <div key={ index } className="mb-4">
              <div>
                <label htmlFor={ `faq-question-${ index }` } className="block text-sm font-medium text-gray-700">
                  Question
                </label>
                <Input
                  type="text"
                  id={ `faq-question-${ index }` }
                  value={ faq.question }
                  onChange={ ( e ) => handleFaqChange( e, index, 'question' ) }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter your question"
                />
                { faq.question.trim() === '' && faq.answer.trim() !== '' && (
                  <p className="text-red-500 text-sm mt-1">A question is required if you provide an answer.</p>
                ) }
              </div>
              <div className="mt-2">
                <label htmlFor={ `faq-answer-${ index }` } className="block text-sm font-medium text-gray-700">
                  Answer
                </label>
                <Input
                  id={ `faq-answer-${ index }` }
                  value={ faq.answer }
                  onChange={ ( e ) => handleFaqChange( e, index, 'answer' ) }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter your answer"
                />
                { faq.answer.trim() === '' && faq.question.trim() !== '' && (
                  <p className="text-red-500 text-sm mt-1">An answer is required if you provide a question.</p>
                ) }
              </div>
              <button
                type="button"
                onClick={ () => removeFaq( index ) }
                className="mt-2 text-red-500 hover:text-red-700 text-sm"
              >
                Remove FAQ
              </button>
            </div>
          ) ) }
          <button
            type="button"
            onClick={ addFaq }
            className="mt-2 text-blue-500 hover:text-blue-700 text-sm"
          >
            + Add question
          </button>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Add highlights about your event</h3>

          {/* Age Restriction Options */ }
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Is there an age restriction?</p>
            <div className="flex gap-4">
              { [ 'All ages allowed', 'There’s an age restriction', 'Parent or guardian needed' ].map( ( option ) => (
                <button
                  key={ option }
                  type="button"
                  onClick={ () => handleAgeRestrictionChange( option ) }
                  className={ `py-2 px-4 border rounded-md ${ ageRestriction === option ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
                    }` }
                >
                  { option }
                </button>
              ) ) }
            </div>
          </div>

          {/* Parking Options */ }
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Is there parking at your venue?</p>
            <div className="flex gap-4">
              { [ 'Free parking', 'Paid parking', 'No parking options' ].map( ( option ) => (
                <button
                  key={ option }
                  type="button"
                  onClick={ () => handleParkingOptionsChange( option ) }
                  className={ `py-2 px-4 border rounded-md ${ parkingOptions === option ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
                    }` }
                >
                  { option }
                </button>
              ) ) }
            </div>
          </div>
        </div>



        <div>
          <label htmlFor="maxAttendees" className="block text-sm font-medium text-gray-700">
            Max Attendees
          </label>
          <Input
            type="number"
            id="maxAttendees"
            value={ maxAttendees.toString() }
            onChange={ ( e ) => setMaxAttendees( Number( e.target.value ) ) }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Max Attendees"
          />
        </div>


        {/* Sticky Footer Button */ }
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-md flex justify-center">
          <Button
            type="submit"
            radius="sm"
            className="px-6 py-2 bg-orange-500 text-white text-xl rounded-3xl"
          >
            Update Event
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditEventPage;
