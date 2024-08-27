interface EventImageProps
{
  imageUrl: string;
  alt?: string;
  overlayColor?: string;
  children?: React.ReactNode;
  height?: string; // New prop for height
}

export default function EventImage ( {
  imageUrl,
  alt = "Event image",
  overlayColor = "bg-indigo-700",
  children,
  height = "h-125" // Default height, adjust as needed
}: EventImageProps )
{
  return (
    <div className="mx-auto max-w-7xl">
      <div className={ `relative shadow-xl overflow-hidden ${ height } rounded-lg sm:rounded-2xl` }>
        <div className="absolute inset-0">
          <img
            alt={ alt }
            src={ imageUrl }
            className="h-full w-full object-cover"
          />
          <div className={ `absolute inset-0 ${ overlayColor } mix-blend-multiply` } />
        </div>
        <div className="relative h-full flex items-center justify-center">
          <div className="px-6 py-16 sm:py-24 lg:px-8 lg:py-32">
            { children }
          </div>
        </div>
      </div>
    </div>
  );
}

// Example Usage
// <EventImage
//   imageUrl={eventData.featuredImage || ''}
//   alt={`${eventData.eventName} image`}
//   overlayColor="bg-black bg-opacity-50"
//   height="h-[460px] xl:h-[537px]"
// >
//   <div className="text-center text-white">
//     <h1 className="font-extrabold text-5xl mb-2">{eventData.eventName}</h1>
//     <h2 className="mb-4 text-xl font-semibold">{eventData.description}</h2>
//     <p className="text-lg font-normal">{`Location: ${eventData.venue || "No venue available"}`}</p>
//   </div>
// </EventImage>
