


import Image from "next/image";
import { Svg } from "tabler-icons-react";
import SvgBackground from "../Backgrounds/SquareSvgBackground";


export default function NavBarTW ()
{
  return (
    <div className="">
      <SvgBackground />
      <main>
        <div>
          {/* Hero card */ }
          <div className="relative">
            <div className="absolute inset-x-0 bottom-0 h-1/2" />
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
              <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
                <div className="absolute inset-0">
                  <Image
                    priority
                    alt="People working on laptops"
                    height={ 1024 }
                    width={ 1536 }
                    src="/images/festival-2.webp"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-blue-700 mix-blend-multiply" />
                </div>
                <div className="relative px-6 py-16 sm:py-24 lg:px-8 lg:py-32">
                  <h1 className="text-center text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                    <span className="block text-white">
                      Event Management Software
                    </span>
                    <span className="block text-blue-200">For Non Profits</span>
                  </h1>
                  <p className="mx-auto mt-6 max-w-lg text-center text-xl text-blue-200 sm:max-w-3xl">
                    Our platform has everything you need to run your events from
                    start to finish.
                  </p>
                  <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                    <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                      <a
                        href="signup"
                        className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-blue-700 shadow-sm hover:bg-blue-50 sm:px-8"
                      >
                        Get started
                      </a>
                      <a
                        href="/signup"
                        className="flex items-center justify-center rounded-md border border-transparent bg-blue-500 bg-opacity-60 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-opacity-70 sm:px-8"
                      >
                        Live demo
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Logo cloud */ }

        </div>

        {/* More main page content here... */ }
      </main>
    </div>
  );
}
