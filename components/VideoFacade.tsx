'use client';

import Image from 'next/image';
import { useState } from 'react';

type VideoFacadeProps = {
  videoUrl: string;
  thumbnailUrl: string;
};

export default function VideoFacade ( { videoUrl, thumbnailUrl }: VideoFacadeProps )
{
  const [ isVideoLoaded, setIsVideoLoaded ] = useState( false );

  const handleClick = () =>
  {
    setIsVideoLoaded( true );
  };

  return (
    <div className="relative mx-auto w-full rounded-2xl  lg:max-w-full">
      { !isVideoLoaded ? (
        <button
          type="button"
          onClick={ handleClick }
          className="relative block w-full overflow-hidden rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <div className="relative w-full h-[215px] sm:h-[320px] md:h-[400px] lg:h-[342px]"> {/* Responsive height */ }
            <Image
              src={ thumbnailUrl }
              alt="Video thumbnail"
              layout="fill" // Makes the image fill the container
              objectFit="contain" // Ensure the entire image fits within the container
              className="rounded-2xl"
            />
          </div>
          <span aria-hidden="true" className="absolute inset-0 flex h-full w-full items-center justify-center">
            <svg fill="currentColor" viewBox="0 0 84 84" className="h-20 w-20 text-blue-500">
              <circle r={ 42 } cx={ 42 } cy={ 42 } fill="white" opacity="0.9" />
              <path d="M55.5039 40.3359L37.1094 28.0729C35.7803 27.1869 34 28.1396 34 29.737V54.263C34 55.8604 35.7803 56.8131 37.1094 55.9271L55.5038 43.6641C56.6913 42.8725 56.6913 41.1275 55.5039 40.3359Z" />
            </svg>
          </span>
        </button>
      ) : (
        <iframe
          width="100%"
          height="450px"
          src={ videoUrl }
          title="Video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[450px] rounded-2xl" // Responsive height
        ></iframe>
      ) }
    </div>
  );
}
