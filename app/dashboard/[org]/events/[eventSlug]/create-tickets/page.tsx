'use client';


import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

import { getEventIdBySlug } from '../../../../../actions/getEventIdBySlug';
import toast from 'react-hot-toast';
import { createTicketType } from '@/app/actions/ticketActions';

import ModalEventCreation from '@/components/modals/ModalEventCreation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@nextui-org/button';

// Define the interface for a question
interface TicketTypeQuestion
{
    id: string;
    questionText: string;
    isRequired: boolean;
    questionType: string; // 'text', 'multiple_choice', etc.
    options?: string[]; // For multiple-choice questions
}

const CreateTicketsPage = () =>
{
    const [ ticketName, setTicketName ] = useState( '' );
    const [ description, setDescription ] = useState( '' );
    const [ price, setPrice ] = useState( 0 );
    const [ quantity, setQuantity ] = useState( 0 );
    const [ saleStartDate, setSaleStartDate ] = useState( '' );
    const [ saleEndDate, setSaleEndDate ] = useState( '' );
    const [ eventDate, setEventDate ] = useState( '' );
    const [ doorOpenTime, setDoorOpenTime ] = useState( '' ); // New state for door open time
    const [ eventStartTime, setEventStartTime ] = useState( '' ); // New state for event start time
    const [ eventEndTime, setEventEndTime ] = useState( '' ); // New state for event end time
    const [ isEarlyBird, setIsEarlyBird ] = useState( false );
    const [ maxPerCustomer, setMaxPerCustomer ] = useState( 1 );
    const [ eventId, setEventId ] = useState<string | null>( null );
    const [ isModalOpen, setIsModalOpen ] = useState( false );
    const { user } = useUser();
    const { eventSlug } = useParams();
    const [ questions, setQuestions ] = useState<TicketTypeQuestion[]>( [] );
    useEffect( () =>
    {
        async function fetchEventId ()
        {
            if ( eventSlug )
            {
                const id = await getEventIdBySlug( eventSlug as string );
                setEventId( id );
            }
        }

        fetchEventId();
    }, [ eventSlug ] );
    // Function to add a new question
    const handleAddQuestion = () =>
    {
        const newQuestion: TicketTypeQuestion = {
            id: Date.now().toString(),
            questionText: '',
            isRequired: true,
            questionType: 'text',
            options: [],
        };
        setQuestions( [ ...questions, newQuestion ] );
    };

    // Function to update a question
    const handleQuestionChange = ( id: string, field: string, value: any ) =>
    {
        setQuestions( ( prevQuestions ) =>
            prevQuestions.map( ( q ) => ( q.id === id ? { ...q, [ field ]: value } : q ) )
        );
    };

    // Function to remove a question
    const handleRemoveQuestion = ( id: string ) =>
    {
        setQuestions( ( prevQuestions ) => prevQuestions.filter( ( q ) => q.id !== id ) );
    };

    if ( !eventId )
    {
        return <p className="text-center text-lg text-gray-700">Loading...</p>;
    }

    const handleSubmit = async ( e: { preventDefault: () => void } ) =>
    {
        e.preventDefault();
        if ( !user ) return;

        const orgId = user.organizationId;

        const formData = new FormData();
        formData.append( 'orgId', orgId );
        formData.append( 'eventId', eventId );
        formData.append( 'name', ticketName );
        formData.append( 'description', description );
        formData.append( 'price', price.toString() );
        formData.append( 'quantity', quantity.toString() );
        formData.append( 'saleStartDate', saleStartDate );
        formData.append( 'saleEndDate', saleEndDate );
        formData.append( 'eventDate', eventDate );
        formData.append( 'doorOpenTime', doorOpenTime ); // Append door open time
        formData.append( 'eventStartTime', eventStartTime ); // Append event start time
        formData.append( 'eventEndTime', eventEndTime ); // Append event end time
        formData.append( 'isEarlyBird', isEarlyBird.toString() );
        formData.append( 'questions', JSON.stringify( questions ) );
        formData.append( 'maxPerCustomer', maxPerCustomer?.toString() ?? '' );

        try
        {
            const response = await createTicketType( formData );

            if ( response.success )
            {
                toast.success( 'Ticket type created successfully!' );
                // Clear form
                setTicketName( '' );
                setDescription( '' );
                setPrice( 0 );
                setQuantity( 0 );
                setSaleStartDate( '' );
                setSaleEndDate( '' );
                setEventDate( '' );
                setDoorOpenTime( '' ); // Clear door open time
                setEventStartTime( '' ); // Clear event start time
                setEventEndTime( '' ); // Clear event end time
                setIsEarlyBird( false );
                setMaxPerCustomer( 1 );
                setQuestions( [] );
                setIsModalOpen( true );
            } else
            {
                toast.error( 'Failed to create ticket type: ' + response.message );
            }
        } catch ( error )
        {
            console.error( 'Error creating ticket type:', error );
            toast.error( 'An unexpected error occurred.' );
        }
    };

    return (
        <div className="container mx-auto max-w-3xl bg-white  rounded-lg">
            <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">Create ticket types for your Event</h1>
            <p className="mb-8 text-center text-gray-600">
                Fill in the details below to create a new ticket type for your event. Define different ticket types like General Admission, VIP, or Early Bird, and set their respective prices, quantities, and sale dates.
            </p>

            <form onSubmit={ handleSubmit } className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ticket Name</label>
                    <Input
                        type="text"
                        value={ ticketName }
                        onChange={ ( e ) => setTicketName( e.target.value ) }
                        placeholder="Ticket Name"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <Textarea
                        value={ description }
                        onChange={ ( e ) => setDescription( e.target.value ) }
                        placeholder="Description"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                </div>
                {/* Questions Section */ }
                <div>
                    <h2 className="text-xl font-bold mb-4">Questions for Ticket Buyers</h2>
                    { questions.map( ( question ) => (
                        <div key={ question.id } className="mb-4 p-4 border rounded">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Question Text</label>
                                <Input
                                    type="text"
                                    value={ question.questionText }
                                    onChange={ ( e ) =>
                                        handleQuestionChange( question.id, 'questionText', e.target.value )
                                    }
                                    placeholder="Enter your question"
                                    required
                                    className="mt-1 block w-full"
                                />
                            </div>

                            <div className="mt-2">
                                <label className="block text-sm font-medium text-gray-700">Question Type</label>
                                <select
                                    value={ question.questionType }
                                    onChange={ ( e ) =>
                                        handleQuestionChange( question.id, 'questionType', e.target.value )
                                    }
                                    className="mt-1 block w-full"
                                >
                                    <option value="text">Text</option>
                                    <option value="multiple_choice">Multiple Choice</option>
                                </select>
                            </div>

                            { question.questionType === 'multiple_choice' && (
                                <div className="mt-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Options (comma-separated)
                                    </label>
                                    <Input
                                        type="text"
                                        value={ question.options?.join( ', ' ) || '' }
                                        onChange={ ( e ) =>
                                            handleQuestionChange( question.id, 'options', e.target.value.split( ',' ) )
                                        }
                                        placeholder="Option1, Option2, Option3"
                                        className="mt-1 block w-full"
                                    />
                                </div>
                            ) }

                            <div className="mt-2 flex items-center">
                                <input
                                    type="checkbox"
                                    checked={ question.isRequired }
                                    onChange={ ( e ) =>
                                        handleQuestionChange( question.id, 'isRequired', e.target.checked )
                                    }
                                    className="h-4 w-4 text-blue-600"
                                />
                                <label className="ml-2 block text-sm text-gray-700">Required</label>
                            </div>

                            <Button
                                color="danger"
                                onClick={ () => handleRemoveQuestion( question.id ) }
                                className="mt-2"
                            >
                                Remove Question
                            </Button>
                        </div>
                    ) ) }

                    <Button onClick={ handleAddQuestion } color="primary">
                        Add Question
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <Input
                            type="number"
                            value={ price.toString() } // Convert number to string
                            onChange={ ( e ) => setPrice( Number( e.target.value ) ) } // Convert string back to number
                            placeholder="Price"
                            required
                            className="mt-1 block w-full focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Quantity</label>
                        <Input
                            type="number"
                            value={ quantity.toString() } // Convert number to string
                            onChange={ ( e ) => setQuantity( Number( e.target.value ) ) }
                            placeholder="Quantity"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Sale Start Date</label>
                        <Input
                            type="date"
                            value={ saleStartDate }
                            onChange={ ( e ) => setSaleStartDate( e.target.value ) }
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Sale End Date</label>
                        <Input
                            type="date"
                            value={ saleEndDate }
                            onChange={ ( e ) => setSaleEndDate( e.target.value ) }
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Event Date</label>
                        <Input
                            type="date"
                            value={ eventDate }
                            onChange={ ( e ) => setEventDate( e.target.value ) }
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Door Open Time</label>
                        <Input
                            type="time"
                            value={ doorOpenTime }
                            onChange={ ( e ) => setDoorOpenTime( e.target.value ) }
                            placeholder="HH:MM"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Event Start Time</label>
                        <Input
                            type="time"
                            value={ eventStartTime }
                            onChange={ ( e ) => setEventStartTime( e.target.value ) }
                            placeholder="HH:MM"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Event End Time</label>
                        <Input
                            type="time"
                            value={ eventEndTime }
                            onChange={ ( e ) => setEventEndTime( e.target.value ) }
                            placeholder="HH:MM"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                    </div>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={ isEarlyBird }
                        onChange={ ( e ) => setIsEarlyBird( e.target.checked ) }
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 block text-sm font-medium text-gray-700">Early Bird</label>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Max Per Customer</label>
                    <Input
                        type="number"
                        value={ maxPerCustomer.toString() } // Convert number to string
                        onChange={ ( e ) => setMaxPerCustomer( Number( e.target.value ) ) }
                        placeholder="Max Per Customer"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                </div>

                <Button
                    type="submit"
                    color="warning"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Create Ticket
                </Button>
            </form>


            { isModalOpen && (
                <ModalEventCreation onClose={ () => setIsModalOpen( false ) }>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Ticket Types Created Successfully!</h1>
                        <p className="text-gray-700 mb-4">
                            Your ticket types for the event have been created. You can now share the event page with your audience.
                        </p>
                        <Button as="a" href={ `/events/${ eventSlug }` } color="warning">
                            View Event Page
                        </Button>
                    </div>
                </ModalEventCreation>
            ) }
        </div>
    );
};

export default CreateTicketsPage;
