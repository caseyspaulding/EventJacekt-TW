import { Button } from '@nextui-org/react';

interface FileUploadButtonProps
{
  setFeaturedImage: ( file: File | null ) => void;
}

export function FileUploadButton ( { setFeaturedImage }: FileUploadButtonProps )
{
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
          onChange={ ( e ) => setFeaturedImage( e.target.files?.[ 0 ] || null ) }
          style={ { display: 'none' } } // Hide the actual file input
        />
      </Button>
    </div>
  );
}
