import { Button } from '@nextui-org/react';
import React from 'react';

interface FileUploadButtonProps
{
  setImage: ( file: File | null ) => void;
  previewImage: string | null;
  setPreviewImage: ( imageUrl: string | null ) => void;
  label: string; // New prop for dynamic label
}

export function ImageUploadVenue ( {
  setImage,
  previewImage,
  setPreviewImage,
  label,
}: FileUploadButtonProps )
{
  const handleFileChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
  {
    const file = e.target.files?.[ 0 ] || null;
    setImage( file );

    if ( file )
    {
      const reader = new FileReader();
      reader.onloadend = () =>
      {
        setPreviewImage( reader.result as string );
      };
      reader.readAsDataURL( file );
    } else
    {
      setPreviewImage( null );
    }
  };

  return (
    <div className="relative w-full bg-gray-100 rounded-md overflow-hidden shadow-md">
      {/* Placeholder or Preview Image */ }
      <img
        src={ previewImage || '/images/venue.jpg' } // Placeholder image path
        alt="Preview or Placeholder"
        className="w-full h-full object-cover"
      />

      {/* Overlay for Upload Button */ }
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-75 transition-opacity">
        {/* Icon (Optional) */ }
        <div className="text-white mb-2">
          {/* Example of an upload icon */ }
          
          
        </div>
        {/* Upload Text */ }
        <p className="text-white text-lg font-semibold mb-4">
          { label } {/* Dynamic label */ }
        </p>
        {/* Upload Button */ }
        <Button
          as="label"
          className="bg-blue-700 text-white px-5 py-6 text-xl rounded-md cursor-pointer"
          radius="sm"
        ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-10">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>
          Upload Venue Image
          <input
            type="file"
            accept="image/*"
            onChange={ handleFileChange }
            style={ { display: 'none' } } // Hide the actual file input
          />
        </Button>
      </div>
    </div>
  );
}
