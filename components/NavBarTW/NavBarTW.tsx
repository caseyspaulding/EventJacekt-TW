


import Image from "next/image";
import { Svg } from "tabler-icons-react";
import SvgBackground from "../Backgrounds/SquareSvgBackground";
import { Button } from "flowbite-react";
import VideoFacade from "../VideoFacade";
import VideoFacadeAutoPlay from "../VideoFacadeAutoPlay";


export default function NavBarTW ()
{
  return (
    <>
      <div className="relative overflow-hidden pb-36">

        <div aria-hidden="true" className="absolute inset-0 hidden lg:block">
  <svg
    fill="none"
    width={640}
    height={784}
    viewBox="0 0 640 784"
    className="absolute left-1/2 top-0 -translate-y-8 translate-x-64 transform"
  >
    <defs>
      <pattern
        x={118}
        y={0}
        id="9ebea6f4-a1f5-4d96-8c4e-4c2abf658047"
        width={20}
        height={20}
        patternUnits="userSpaceOnUse"
      >
        <rect x={0} y={0} fill="currentColor" width={4} height={4} className="text-gray-200" />
      </pattern>
    </defs>
    <rect y={72} fill="currentColor" width={640} height={640} className="text-gray-50" />
    <rect x={118} fill="url(#9ebea6f4-a1f5-4d96-8c4e-4c2abf658047)" width={404} height={784} />
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
                  <span className="block text-blue-600">For Non Profits</span>
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                EventJacket is your all-in-one event management platform, offering tools to create, manage, and sell tickets for events with ease.
              </p>
              <div className="mt-8 sm:mx-auto sm:max-w-lg sm:text-center lg:mx-0 lg:text-left">
                <p className="text-base font-medium mb-3  text-gray-400">Sign up to get notified when it’s ready.</p>
                <div className="relative group cursor-pointer">
                  <div
                    className="absolute -inset-1 bg-gradient-to-r from-blue-700 to-blue-600 rounded-lg blur opacity-35 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"
                  ></div>
                <Button
                  size="lg"
                  href="/signup"
                  className="relative px-7 py-3 bg-blue-700 text-white font-bold text-2xl rounded-lg leading-none ring-1 ring-gray-900/5"
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
                  
                  className="relative block w-full overflow-hidden rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                 
                  <VideoFacade
                    videoUrl="https://mphgaanpbwsetutodyvl.supabase.co/storage/v1/object/sign/videos/whidbey_ren_faire_recap_video%20(720p).mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2aWRlb3Mvd2hpZGJleV9yZW5fZmFpcmVfcmVjYXBfdmlkZW8gKDcyMHApLm1wNCIsImlhdCI6MTcyMzQ4NDgyOSwiZXhwIjoxNzg2NTU2ODI5fQ.6LeGBAjUPUZxoDAl8YOQ9IqCHnotJWud_y8VW-2VEVI&t=2024-08-12T17%3A47%3A07.983Z"
                    thumbnailUrl="/images/avatars/wrf.jpg"
                    caption=""
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
