// components/EventDetailsForm.tsx
import React from 'react';
import { Input, Textarea } from '@nextui-org/react';
import { FileUploadButton } from './FileUploadButton';

const EventDetailsForm = ( { formData, setFormData } ) =>
{
  const handleChange = ( e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) =>
  {
    const { name, value } = e.target;
    setFormData( ( prevData ) => ( {
      ...prevData,
      eventDetails: {
        ...prevData.eventDetails,
        [ name ]: value,
      },
    } ) );
  };

  const handleImageUpload = ( file: File | null ) =>
  {
    setFormData( ( prevData ) => ( {
      ...prevData,
      eventDetails: {
        ...prevData.eventDetails,
        featuredImage: file,
      },
    } ) );
  };

  return (
    <div>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Event Name
        </label>
        <Input
          type="text"
          id="name"
          name="name"
          value={ formData.eventDetails.name || '' }
          onChange={ handleChange }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Event Name"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          value={ formData.eventDetails.description || '' }
          onChange={ handleChange }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Description"
          required
        />
      </div>
      <div>
        <label className="block text-sm mb-3 font-medium text-gray-700">
          Event Featured Image
        </label>
        <FileUploadButton setFeaturedImage={ handleImageUpload } />
      </div>
      {/* Add more fields for start date, end date, venue, etc. */ }
    </div>
  );
};

export default EventDetailsForm;
