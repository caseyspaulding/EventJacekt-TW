'use client';


import { createClient } from '@utils/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { generateSlug } from '@/utils/stringUtils';
import toast from 'react-hot-toast';
import { createEvent } from '@/app/actions/eventActions';
import ModalBasic from '@/components/modals/ModalBasic';
import { Button } from '@nextui-org/react';
import { FileUploadButton } from './FileUploadButton';

import BreadcrumbsPageHeader from '../../components/BreadcrumbsPageHeading';
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { ImageUploadVenue } from './ImageUploadVenue';

import dynamic from 'next/dynamic';
import InputFieldEJ from '@/components/Input/InputEJ';

import Head from 'next/head';
import Script from 'next/script';
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import TimePicker from '@/components/TimePicker';
import DatePicker from '@/components/DatePicker';



const VenueMap = dynamic( () => import( '@/components/VenueMap' ), {
    ssr: false, // This prevents server-side rendering of the component
} );


type FAQ = {
    question: string;
    answer: string;
};



const CreateEventPage = () =>
{

    const [ name, setName ] = useState( '' );
    const [ description, setDescription ] = useState( '' );
    const [ startDate, setStartDate ] = useState( '' );
    const [ endDate, setEndDate ] = useState( '' );


    const [ eventStartTime, setEventStartTime ] = useState( '' );

    const [ eventEndTime, setEventEndTime ] = useState( '' );
    const [ organizerContact, setOrganizerContact ] = useState( '' );

    const [ venue, setVenue ] = useState( '' );
    const [ venueDescription, setVenueDescription ] = useState( '' );
    const [ address, setAddress ] = useState( '' );
    const [ city, setCity ] = useState( '' );
    const [ state, setState ] = useState( '' );
    const [ country, setCountry ] = useState( '' );
    const [ zipCode, setZipCode ] = useState( '' );
    const [ maxAttendees, setMaxAttendees ] = useState( 0 );
    const [ isModalOpen, setIsModalOpen ] = useState( false );
    const { user } = useUser();
    const [ featuredImage, setFeaturedImage ] = useState<File | null>( null );
    const [ venueImage, setVenueImage ] = useState<File | null>( null );
    const [ slug, setSlug ] = useState<string | null>( null );
    const [ notes, setNotes ] = useState( '' );
    const [ scheduleDetails, setScheduleDetails ] = useState( '' );
    const [ refundPolicy, setRefundPolicy ] = useState( '' );
    const [ timezone, setTimezone ] = useState( '' );
    const [ tags, setTags ] = useState( '' );
    const [ faqs, setFaqs ] = useState<{ question: string; answer: string }[]>( [ { question: '', answer: '' } ] );
    const [ highlights, setHighlights ] = useState( '' );
    const [ ageRestriction, setAgeRestriction ] = useState( '' );
    const [ parkingOptions, setParkingOptions ] = useState( '' );


    const [ previewImage, setPreviewImage ] = useState<string | null>( null ); // New state for image preview

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleEventStartTimeChange = ( time: string ) =>
    {
        setEventStartTime( time )
        console.log( 'Selected time:', time )
    }

    const handleEventStartDateChange = ( date: string ) =>
    {
        setStartDate( date )

    }

    const handleEventEndDateChange = ( date: string ) =>
    {
        setEndDate( date )

    }

    const handleEventEndTimeChange = ( time: string ) =>
    {
        setEventEndTime( time )
        console.log( 'Selected time:', time )
    }

    const [ venueImagePreview, setVenueImagePreview ] = useState<string | null>( null ); // State for the venue image preview
    const [ agendaItems, setAgendaItems ] = useState<{ title: string; startTime: string; endTime: string; description: string; hostOrArtist: string }[]>( [ { title: '', startTime: '', endTime: '', description: '', hostOrArtist: '' } ] );

    const handleImageUpload = async ( file: File | null, orgName: string, bucketName: string ) =>
    {
        if ( !file )
        {
            console.error( 'No file selected' );
            return null;
        }

        const uniqueFilename = `${ orgName }_${ Date.now() }_${ file.name }`;
        const { error } = await createClient()
            .storage.from( bucketName ) // Use bucketName to decide which bucket to upload to
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

    const handleSubmit = async ( e: { preventDefault: () => void } ) =>
    {
        e.preventDefault();
        if ( !user ) return;

        const orgId = user.organizationId;

        // Try uploading images, but don't block if no image is uploaded
        // Upload featured image to "eventFeaturedImages" bucket
        const featuredImageUrl = featuredImage ? await handleImageUpload( featuredImage, user.orgName, 'eventFeaturedImages' ) : '';

        // Upload venue image to "venueImages" bucket
        const venueImageUrl = venueImage ? await handleImageUpload( venueImage, user.orgName, 'venueImages' ) : '';


        const generatedSlug = generateSlug( name );
        setSlug( generatedSlug );

        // Convert date strings to ISO format
        const startDateISO = startDate ? new Date( startDate ).toISOString() : null;
        const endDateISO = endDate ? new Date( endDate ).toISOString() : null;

        const formData = new FormData();
        formData.append( 'orgId', orgId );
        formData.append( 'name', name );
        formData.append( 'slug', generatedSlug );
        formData.append( 'description', description );
        formData.append( 'startDate', startDateISO || '' ); // Ensure it's in ISO format
        formData.append( 'endDate', endDateISO || '' );     // Ensure it's in ISO format
        formData.append( 'eventStartTime', eventStartTime );
        formData.append( 'eventEndTime', eventEndTime );
        formData.append( 'venue', venue );
        formData.append( 'venueDescription', venueDescription );
        formData.append( 'address', address );
        formData.append( 'city', city );
        formData.append( 'state', state );
        formData.append( 'country', country );
        formData.append( 'zipCode', zipCode );
        formData.append( 'organizerContact', organizerContact );

        formData.append( 'maxAttendees', maxAttendees.toString() );
        formData.append( 'status', 'draft' );
        // Only append image URLs if they exist
        if ( featuredImageUrl )
        {
            formData.append( 'featuredImage', featuredImageUrl );
        }
        if ( venueImageUrl )
        {
            formData.append( 'venueImage', venueImageUrl );
        }
        formData.append( 'notes', notes );
        formData.append( 'scheduleDetails', scheduleDetails );
        formData.append( 'refundPolicy', refundPolicy );
        formData.append( 'timezone', timezone );
        formData.append( 'tags', tags );
        formData.append( 'faqs', JSON.stringify( faqs ) );
        formData.append( 'highlights', highlights );
        formData.append( 'ageRestriction', ageRestriction );
        formData.append( 'parkingOptions', parkingOptions );
        formData.append( 'agendaItems', JSON.stringify( agendaItems ) );

        try
        {
            const response = await createEvent( formData );

            if ( response.success )
            {
                toast.success(
                    <>
                        Event created successfully!{ ' ' }
                        <a href={ `/events/${ generatedSlug }` } target="_blank" rel="noopener noreferrer">
                            View Event Page
                        </a>
                    </>
                );
                setIsModalOpen( true );
                // Clear form
                setName( '' );
                setDescription( '' );
                setStartDate( '' );
                setEndDate( '' );
                setEventStartTime( '' );
                setEventEndTime( '' );
                setVenue( '' );
                setVenueDescription( '' );
                setAddress( '' );
                setCity( '' );
                setState( '' );
                setCountry( '' );
                setZipCode( '' );
                setMaxAttendees( 0 );
                setFeaturedImage( null );
                setNotes( '' );
                setScheduleDetails( '' );
                setRefundPolicy( '' );
                setTimezone( '' );
                setTags( '' );
                setFaqs( [ { question: '', answer: '' } ] );
                setHighlights( '' );
                setAgeRestriction( '' );
                setParkingOptions( '' );
                setAgendaItems( [ { title: '', startTime: '', endTime: '', description: '', hostOrArtist: '' } ] );
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
    const breadcrumbs = [
        { name: 'Dashboard', href: '/' },
        { name: 'Events', href: '/events' },
        { name: 'Create Event', href: '/events/create', current: true },
    ];
    // Combine all address fields into a single string
    //const handlePlaceSelected = ( place: google.maps.places.PlaceResult ) =>
    //{
    //    console.log( 'Selected Place:', place );
    //    // Handle the place details here
    //};



    const mapAddress = `${ address }, ${ city }, ${ state }, ${ zipCode }` || '';

    return ( <>
        <Head>
            <title>Create Event | Dashboard | EventJacket</title>
            <meta name="description" content="Create a new event on EventJacket" />
            <Script src="https://accounts.google.com/gsi/client" defer></Script>

        </Head>
        <div className="p-1 lg:px-3 lg:py-4 sm:py-1 sm:px-2 bg-white">
            {/* Page Header */ }
            <BreadcrumbsPageHeader title="Create Event" breadcrumbs={ breadcrumbs } />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-8">
                {/* Main Form Content */ }
                <form onSubmit={ handleSubmit } className="space-y-6 pb-24 lg:col-span-2">
                    <div id="step1">
                        <label className="block font-semibold text-lg text-gray-700">
                            Add an event featured image
                        </label>
                        <FileUploadButton
                            setImage={ setFeaturedImage }
                            previewImage={ previewImage }
                            setPreviewImage={ setPreviewImage }
                            label=""
                            orgName={ user?.orgName || '' }
                        />
                    </div>
                    <div id="step2" className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                        <div>
                            <Input
                                type="text"
                                id="name"
                                value={ name }
                                onChange={ ( e ) => setName( e.target.value ) }
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                placeholder="Event Name"
                                required />
                        </div>

                        <div>
                            <Input
                                id="description"
                                value={ description }
                                onChange={ ( e ) => setDescription( e.target.value ) }
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                placeholder="Description"
                                required />
                        </div>

                        <div>
                            
                            <Input
                               
                                id="organizerContact"
                                value={ organizerContact }
                                onChange={ ( e ) => setOrganizerContact( e.target.value ) }
                                className=" block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                placeholder="Organizer Contact Information"

                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Event Start Date
                            </label>

                            <DatePicker

                                id="startDate"
                                value={ startDate }
                                onChange={ handleEventStartDateChange }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm "
                                required

                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Event End Date
                            </label>
                            <DatePicker

                                id="endDate"
                                value={ endDate }
                                onChange={ handleEventEndDateChange }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                required

                            />
                        </div>

                        <div>
                            <label htmlFor="eventStartTime" className="block text-sm font-medium text-gray-700">
                                Event Start Time
                            </label>
                            <TimePicker

                                id="eventStartTime"
                                value={ eventEndTime }
                                onChange={ handleEventStartTimeChange }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                required

                            />

                        </div>

                        <div>
                            <label htmlFor="eventEndTime" className="block text-sm font-medium text-gray-700">
                                Event End Time
                            </label>
                            <TimePicker
                                id="eventEndTime"
                                value={ eventEndTime }
                                onChange={ handleEventEndTimeChange }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                required
                            />
                        </div>
                    </div>

                    <div id="step3">


                        <Input
                            type="text"
                            id="venue"
                            value={ venue }
                            onChange={ ( e ) => setVenue( e.target.value ) }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            placeholder="Add Venue Name"
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
                            placeholder="Address"  />


                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>

                            <Input
                                type="text"
                                id="city"
                                value={ city }
                                onChange={ ( e ) => setCity( e.target.value ) }
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                placeholder="City"  />
                        </div>

                        <div>

                            <Input
                                type="text"
                                id="state"
                                value={ state }
                                onChange={ ( e ) => setState( e.target.value ) }
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                placeholder="State"  />
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
                                placeholder="Zip Code"  />
                        </div>

                    </div>



                    <VenueMap address={ mapAddress || '' } />

                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                            Notes
                        </label>
                        <InputFieldEJ
                            id="notes"
                            value={ notes }
                            onChange={ ( e ) => setNotes( e.target.value ) }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            placeholder="Notes" label={ 'Notes' } />
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
                            placeholder="Details about the schedule, agenda, etc." />
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

                        <InputFieldEJ
                            type="text"
                            id="timezone"
                            value={ timezone }
                            onChange={ ( e ) => setTimezone( e.target.value ) }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            placeholder="Timezone"
                            label={ ' Timezone' } />
                    </div>

                    <div>

                        <InputFieldEJ
                            type="text"
                            id="tags"
                            value={ tags }
                            onChange={ ( e ) => setTags( e.target.value ) }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            placeholder="Tags (comma separated)"
                            label={ 'Tags' } />
                    </div>

                    <div id="step5">
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
                                    <InputFieldEJ
                                        type="text"
                                        id={ `faq-question-${ index }` }
                                        value={ faq.question }
                                        onChange={ ( e ) => handleFaqChange( e, index, 'question' ) }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        placeholder="Enter your question"
                                        label={ 'Question' } />
                                    { faq.question.trim() === '' && faq.answer.trim() !== '' && (
                                        <p className="text-red-500 text-sm mt-1">A question is required if you provide an answer.</p>
                                    ) }
                                </div>
                                <div className="mt-2">
                                    <label htmlFor={ `faq-answer-${ index }` } className="block text-sm font-medium text-gray-700">
                                        Answer
                                    </label>
                                    <InputFieldEJ
                                        id={ `faq-answer-${ index }` }
                                        value={ faq.answer }
                                        onChange={ ( e ) => handleFaqChange( e, index, 'answer' ) }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        placeholder="Enter your answer"
                                        label={ 'Answer' } />
                                    { faq.answer.trim() === '' && faq.question.trim() !== '' && (
                                        <p className="text-red-500 text-sm mt-1">An answer is required if you provide a question.</p>
                                    ) }
                                </div>
                                <button
                                    type="button"
                                    onClick={ () => removeFaq( index ) }
                                    className="mt-2 text-red-500 hover:text-red-700 text-md"
                                >
                                    Remove FAQ
                                </button>
                            </div>
                        ) ) }
                        <button
                            type="button"
                            onClick={ addFaq }
                            className="mt-2 text-green-600 hover:text-green-700 text-md"
                        >
                            + Add question
                        </button>
                    </div>

                    <div id="step6">
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



                    <div id="step7">

                        <InputFieldEJ
                            type="number"
                            id="maxAttendees"
                            value={ maxAttendees.toString() }
                            onChange={ ( e ) => setMaxAttendees( Number( e.target.value ) ) }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            placeholder="Max Attendees"
                            label={ ' Max Attendees' } />
                    </div>

                    {/* Sticky Footer for Small Screens */ }
                    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white p-4 shadow-md flex justify-center">
                        <Button
                            type="submit"
                            radius="sm"
                            className="px-6 py-2 bg-blue-700 text-white font-medium text-xl rounded-3xl"
                        >
                            Save Event
                        </Button>
                    </div>
                </form>

                {/* Sticky Aside for Large Screens */ }
                <aside className="hidden lg:block lg:col-span-1 sticky top-20">
                    <div className="space-y-6 sticky top-20">
                        {/* Place any additional navigation or steps here */ }
                        <h2 className="font-semibold text-lg text-gray-700">Steps</h2>
                        <ul className="space-y-2">
                            <li><a href="#step1" className="text-blue-500">Step 1: Add Event Featured Image</a></li>
                            <li><a href="#step2" className="text-blue-500">Step 2: Add Event Basic Info</a></li>
                            <li><a href="#step3" className="text-blue-500">Step 3: Add Venue Image</a></li>
                            <li><a href="#step4" className="text-blue-500">Step 4: Add Venue Info</a></li>
                            <li><a href="#step5" className="text-blue-500">Step 5: Add Event FAQs</a></li>
                            <li><a href="#step6" className="text-blue-500">Step 6: Add Event Highlights</a></li>
                            <li><a href="#step7" className="text-blue-500">Step 7: Save Event</a></li>
                            <li><div className="text-blue-500">Step 8: Create Event Tickets</div></li>


                            {/* Add more steps as necessary */ }
                        </ul>

                        <div className="mt-6">
                            <Button
                                type="submit"
                                radius="sm"
                                className="w-full py-2 bg-blue-700 text-white font-medium text-xl rounded-3xl"
                            >
                                Save Event
                            </Button>
                        </div>
                    </div>
                </aside>
            </div>

            <ModalBasic isOpen={ isModalOpen } onClose={ handleModalClose } user={ user } slug={ slug as string } />
        </div>
    </>
    );
};

export default CreateEventPage;
