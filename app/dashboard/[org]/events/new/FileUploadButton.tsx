import React, { useState } from 'react';
import { Button } from '@nextui-org/react';

interface FileUploadButtonProps
{
  setFeaturedImage: ( file: File | null ) => void;
  previewImage: string | null;
  setPreviewImage: ( imageUrl: string | null ) => void;
}

export function FileUploadButton ( {
  setFeaturedImage,
  previewImage,
  setPreviewImage
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
    <div>
      <Button
        as="label"
        className='w-full bg-orange-500 text-white'
        radius="sm"
      >
        Upload Image
        <input
          type="file"
          accept="image/*"
          onChange={ handleFileChange }
          style={ { display: 'none' } } // Hide the actual file input
        />
      </Button>

      { previewImage && (
        <div className="mt-4">
          <img
            src={ previewImage }
            alt="Preview"
            className="w-full h-auto rounded-md shadow-md"
          />
        </div>
      ) }
    </div>
  );
}
