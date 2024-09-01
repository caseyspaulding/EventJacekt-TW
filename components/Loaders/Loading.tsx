// components/LoadingScreen.tsx
export const LoadingScreen = () =>
{
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center">
        {/* You can replace this with a GIF or spinner */ }
        <img src="/GIFs/rocket.webp" alt="Loading" className="h-300 w-300" />
        <p className="mt-4 text-lg font-medium text-gray-700">
          We are building your dashboard. Please wait...
        </p>
      </div>
    </div>
  );
};
