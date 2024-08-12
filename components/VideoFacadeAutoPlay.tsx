'use client';

type VideoFacadeProps = {
  videoUrl: string;
  thumbnailUrl: string;
  caption?: string; // caption is optional
};

export default function VideoFacadeAutoPlay ( { videoUrl, thumbnailUrl, caption }: VideoFacadeProps )
{
  return (
    <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
      <iframe
        width="100%"
        height="315"
        src={ `${ videoUrl }?autoplay=1&mute=1` } // Add autoplay=1 and mute=1 to the URL
        title="Video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-64 rounded-lg"
      ></iframe>
      { caption && (
        <p className="mt-2 text-center text-sm text-gray-500">{ caption }</p>
      ) }
    </div>
  );
}
