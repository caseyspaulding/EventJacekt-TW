
import { Button } from "flowbite-react";
import VideoFacade from "../VideoFacade";

import 'animate.css';


export default function NavBarTW ()
{
  return (
    <>
      <div className="relative overflow-hidden pb-36">

        <div aria-hidden="true" className="absolute inset-0 hidden lg:block">
          <svg
            fill="none"
            width={ 640 }
            height={ 784 }
            viewBox="0 0 640 784"
            className="absolute left-1/2 top-0 -translate-y-8 translate-x-64 transform"
          >
            <defs>
              <pattern
                x={ 118 }
                y={ 0 }
                id="9ebea6f4-a1f5-4d96-8c4e-4c2abf658047"
                width={ 20 }
                height={ 20 }
                patternUnits="userSpaceOnUse"
              >
                <rect x={ 0 } y={ 0 } fill="currentColor" width={ 4 } height={ 4 } className="text-gray-200" />
              </pattern>
            </defs>
            <rect y={ 72 } fill="currentColor" width={ 640 } height={ 640 } className="text-gray-50" />
            <rect x={ 118 } fill="url(#9ebea6f4-a1f5-4d96-8c4e-4c2abf658047)" width={ 404 } height={ 784 } />
          </svg>
        </div>


        <main className="mx-auto mt-16 max-w-7xl px-4  sm:mt-24 lg:mt-32">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:text-left">
              <h1>
                <span className="block text-base font-semibold text-gray-500 sm:text-lg lg:text-base xl:text-lg">
                  Coming soon
                </span>
                <span className="mt-1 block text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl">
                  <span className="block text-gray-900">Event Management Software</span>
                  <span className="animate__animated animate__rubberBand block text-blue-600">For Non Profits</span>
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                EventJacket is your all-in-one event management platform, offering tools to create, manage, and sell tickets for events with ease.
              </p>
              <div className="mt-8 sm:mx-auto sm:max-w-lg sm:text-center lg:mx-0 lg:text-left">
                <p className="text-base font-medium mb-3  text-gray-400">Sign up to get notified when it’s ready.</p>
                <div className="relative group cursor-pointer">
                  
                  <Button
                    size="md"
                    
                    href="/signup"
                    className=" relative px-6 py-1 bg-orange-500 hover:bg-orange-400 text-white font-medium text-2xl rounded-xl leading-none  ring-gray-900/5"
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
            <div className="relative mt-12 sm:mx-auto sm:max-w-lg lg:col-span-6 lg:mx-0 lg:mt-0 lg:flex lg:max-w-none lg:items-center">

              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="text-center text-gray-400">
                  <span className="text-center text-sm">Featured Video by Whidbey Ren Faire</span>
                </div>

                <div

                  className="relative block w-full shadow-2xl overflow-hidden rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >

                  <VideoFacade
                    videoUrl="https://player.vimeo.com/video/964426661?h=21b1f36f9b"
                    thumbnailUrl="/images/icons/166.png"

                  />



                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

    </>
  );
}
