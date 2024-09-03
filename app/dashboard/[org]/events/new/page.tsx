'use client';


import { createClient } from '@utils/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { generateSlug } from '@/utils/stringUtils';
import toast from 'react-hot-toast';
import { createEvent } from '@/app/actions/eventActions';
import ModalBasic from '@/components/modals/ModalBasic';
import { Button, Input, Textarea } from '@nextui-org/react';
import { FileUploadButton } from './FileUploadButton';

import BreadcrumbsPageHeader from '../../components/BreadcrumbsPageHeading';
import type { ChangeEvent} from 'react';
import { useState } from 'react';

type FAQ = {
    question: string;
    answer: string;
};

const CreateEventPage = () => {
    const [ name, setName ] = useState( '' );
    const [ description, setDescription ] = useState( '' );
    const [ startDate, setStartDate ] = useState( '' );
    const [ endDate, setEndDate ] = useState( '' );
    const [ eventStartTime, setEventStartTime ] = useState( '' );
    const [ eventEndTime, setEventEndTime ] = useState( '' );
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


    const [ agendaItems, setAgendaItems ] = useState<{ title: string; startTime: string; endTime: string; description: string; hostOrArtist: string }[]>( [ { title: '', startTime: '', endTime: '', description: '', hostOrArtist: '' } ] );

    const handleImageUpload = async (file: File | null, orgName: string) => {
        if (!file) {
            console.error('No file selected');
            return null;
        }

        const uniqueFilename = `${orgName}_${file.name}`;
        const { error } = await createClient()
            .storage.from('eventFeaturedImages')
            .upload(`public/${uniqueFilename}`, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Error uploading file:', error.message);
            return null;
        }

        const { data: publicUrlData } = createClient()
            .storage.from('eventFeaturedImages')
            .getPublicUrl(`public/${uniqueFilename}`);

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

        const imageUrl = await handleImageUpload( featuredImage, user.orgName );
        if ( !imageUrl )
        {
            toast.error( 'Failed to upload the image.' );
            return;
        }

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
        formData.append( 'address', address );
        formData.append( 'city', city );
        formData.append( 'state', state );
        formData.append( 'country', country );
        formData.append( 'zipCode', zipCode );
        formData.append( 'maxAttendees', maxAttendees.toString() );
        formData.append( 'status', 'draft' );
        formData.append( 'featuredImage', imageUrl );
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
                toast.success( 'Event created successfully!' );
                setIsModalOpen( true );
                // Clear form
                setName( '' );
                setDescription( '' );
                setStartDate( '' );
                setEndDate( '' );
                setEventStartTime( '' );
                setEventEndTime( '' );
                setVenue( '' );
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
   
    const handleModalClose = () => {
        setIsModalOpen(false);
    };
    const breadcrumbs = [
        { name: 'Dashboard', href: '/' },
        { name: 'Events', href: '/events' },
        { name: 'Create Event', href: '/events/create', current: true },
    ];
    return (
        <div className="my-4 max-w-3xl">
            <BreadcrumbsPageHeader title="Create Event" breadcrumbs={ breadcrumbs } />

            <form onSubmit={ handleSubmit } className="space-y-6">
                <div>
                    <label className="block text-sm mb-3 font-medium text-gray-700">
                        Event Featured Image
                    </label>
                    <FileUploadButton
                        setFeaturedImage={ setFeaturedImage }
                        previewImage={ previewImage }
                        setPreviewImage={ setPreviewImage }
                    />


                </div>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Event Title
                    </label>
                    <Input
                        type="text"
                        id="name"
                        
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Event Name"
                        required
                    />
                </div>

                <div>
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Description
                    </label>
                    <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Description"
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
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
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
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
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
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Venue"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Address
                    </label>
                    <Input
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Address"
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                            City
                        </label>
                        <Input
                            type="text"
                            id="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            placeholder="City"
                        />
                    </div>

                    <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                            State
                        </label>
                        <Input
                            type="text"
                            id="state"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            placeholder="State"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor="country"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Country
                        </label>
                        <Input
                            type="text"
                            id="country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            placeholder="Country"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="zipCode"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Zip Code
                        </label>
                        <Input
                            type="text"
                            id="zipCode"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            placeholder="Zip Code"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                        Notes
                    </label>
                    <Textarea
                        id="notes"
                        value={ notes }
                        onChange={ ( e ) => setNotes( e.target.value ) }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Notes"
                    />
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
                        placeholder="Details about the schedule, agenda, etc."
                    />
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
                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                        Timezone
                    </label>
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
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                        Tags
                    </label>
                    <Input
                        type="text"
                        id="tags"
                        value={ tags }
                        onChange={ ( e ) => setTags( e.target.value ) }
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
                                <Textarea
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
                    <label
                        htmlFor="maxAttendees"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Max Attendees
                    </label>
                    <Input
                        type="number"
                        id="maxAttendees"
                        value={ maxAttendees.toString() }
                        onChange={(e) => setMaxAttendees(Number(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Max Attendees"
                    />
                </div>


                <div className="text-center">
                    <Button
                        type="submit"
                        radius="sm"
                        className='px-4 py-2 bg-orange-500 text-white rounded-lg w-full'
                        
                    >
                        Create Event
                    </Button>
                </div>
            </form>
            <ModalBasic
                isOpen={isModalOpen}
                onClose={handleModalClose}
                user={user}
                slug={slug as string}
            />
        </div>
    );
};

export default CreateEventPage;
