import { Button } from '@nextui-org/button';
import dynamic from 'next/dynamic';


const VideoFacade = dynamic( () => import( '../VideoFacade' ), { ssr: false } );

export default function NavBarTW ()
{
  return (
    <>
      <div className="relative overflow-hidden pb-36">
        <main className="mx-auto mt-16 max-w-7xl px-4 sm:mt-24 lg:mt-32">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:text-left">
              <span className="block text-base font-semibold text-gray-500 sm:text-lg lg:text-base xl:text-lg">
                Just Launched
              </span>
              <h1>
                <span className="mt-1 block text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl">
                  <span className="block underline-effect text-gray-900">Save Thousands on</span>
                  <span className="block text-blue-600 animate-bounce-once">Event Management Software.</span>
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                EventJacket empowers nonprofits to manage vendors, volunteers, attendees, performers, and sponsors in one platform without breaking the bank.
              </p>
              <div className="mt-8 sm:mx-auto sm:max-w-lg sm:text-center lg:mx-0 lg:text-left">
                <Button
                  href="/signup"
                  as="a"
                  className="relative z-10 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-2xl rounded-3xl w-full sm:w-auto px-4 sm:px-52"
                >
                  Free Account
                </Button>
                <p className="mt-4 text-sm text-gray-500">No credit card required. Start today!</p>
              </div>
            </div>
            <div className="relative mt-12 sm:mx-auto sm:max-w-lg lg:col-span-6 lg:mx-0 lg:mt-0 lg:flex lg:max-w-2xl lg:items-center">
              <div className="relative block w-full overflow-hidden rounded-2xl bg-white">
               
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
