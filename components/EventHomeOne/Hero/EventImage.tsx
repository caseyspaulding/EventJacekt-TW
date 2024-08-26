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
  height = "h-96" // Default height, adjust as needed
}: EventImageProps )
{
  return (
    
     
     
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className={ `relative shadow-xl sm:overflow-hidden sm:rounded-2xl ${ height }` }>
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