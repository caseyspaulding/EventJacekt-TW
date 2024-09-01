import Image from 'next/image';

export const LoadingScreen = () =>
{
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="flex flex-col items-center">
        {/* Use Next.js Image component for optimized image loading */ }
        <p className="mt-4 text-base sm:text-lg md:text-xl font-medium text-gray-700 text-center">
          We are building your dashboard....
        </p>
        <Image
          src="/GIFs/rocket.webp"
          alt="Loading"
          width={ 300 }  // Replace with desired width
          height={ 300 } // Replace with desired height
          className="w-2/3 sm:w-1/2 md:w-1/3 lg:w-1/4 max-w-xs"
        />


      </div>
    </div>
  );
};
