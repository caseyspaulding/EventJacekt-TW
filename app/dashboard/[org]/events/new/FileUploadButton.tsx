import { Button } from '@nextui-org/react';
import React from 'react';


interface FileUploadButtonProps
{
  setFeaturedImage: ( file: File | null ) => void;
  previewImage: string | null;
  setPreviewImage: ( imageUrl: string | null ) => void;
}

export function FileUploadButton ( {
  setFeaturedImage,
  previewImage,
  setPreviewImage,
}: FileUploadButtonProps )
{
  const handleFileChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
  {
    const file = e.target.files?.[ 0 ] || null;
    setFeaturedImage( file );

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
        src={ previewImage || '/images/ModernFamilyFunFair.png' } // Placeholder image path
        alt="Preview or Placeholder"
        className="w-full h-full object-cover"
        
      />

      {/* Overlay for Upload Button */ }
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-75 transition-opacity">
        {/* Icon (Optional) */ }
        <div className="text-white mb-2">
          {/* Example of an upload icon */ }
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
        {/* Upload Text */ }
        <p className="text-white text-lg font-semibold mb-4">
          Upload Featured Image Photo
        </p>
        {/* Upload Button */ }
        <Button
          as="label"
          className="bg-white text-blue-500 px-4 py-2 rounded-md cursor-pointer"
          radius="sm"
        >
          Upload
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
