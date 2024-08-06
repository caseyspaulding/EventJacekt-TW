'use client'

import { FooterMain } from "@/components/footer-main"
import FooterFull from "@/components/Footers/FooterFull"
import FooterTW from "@/components/Footers/FooterTW"
import NavBar1 from "@/components/NavBarTW/NavBar1"
import { Footer } from "flowbite-react"
import { JSX, SVGProps } from "react"

const timeline = [
  {
    name: 'Founded EventJacket',
    description: 'EventJacket was born from a vision to simplify event management',
    date: 'Aug 2023',
    dateTime: '2023-08',
  },
  {
    name: 'Beta Launch',
    description: 'Opened EventJacket to beta testers, gathering valuable feedback',
    date: 'Jan 2024',
    dateTime: '2024-01',
  },
  {
    name: 'Feature Expansion',
    description: 'Added advanced ticketing and analytics features',
    date: 'Mar 2024',
    dateTime: '2024-03',
  },
  {
    name: 'Official Launch',
    description: 'EventJacket goes live to the public',
    date: 'Jun 2024',
    dateTime: '2024-06',
  },
]

export default function About ()
{
  return (
    <><NavBar1 /><div className="bg-white">
      <main className="isolate">
        {/* Hero section */ }
        <div className="relative isolate -z-10 overflow-hidden bg-gradient-to-b from-blue-100/20 pt-14">
          <div
            aria-hidden="true"
            className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white shadow-xl shadow-blue-600/10 ring-1 ring-blue-50 sm:-mr-80 lg:-mr-96" />
          <div className="mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-6 xl:grid-cols-1 xl:grid-rows-1 xl:gap-x-8">
              <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:col-span-2 xl:col-auto">
                Empowering event organizers with innovative management solutions
              </h1>
              <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
                <p className="text-lg leading-8 text-gray-600">
                  At EventJacket, we're passionate about revolutionizing the way events are planned and executed. Our platform combines cutting-edge technology with user-friendly design to streamline every aspect of event management, from ticketing to attendee engagement.
                </p>
              </div>
              <img
                src="/images/event-management.jpg"
                alt="Event management dashboard"
                className="mt-10 aspect-[6/5] w-full max-w-lg rounded-2xl object-cover sm:mt-16 lg:mt-0 lg:max-w-none xl:row-span-2 xl:row-end-2 xl:mt-36" />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white sm:h-32" />
        </div>

        {/* Timeline section */ }
        <div className="mx-auto -mt-8 max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 overflow-hidden lg:mx-0 lg:max-w-none lg:grid-cols-4">
            { timeline.map( ( item ) => (
              <div key={ item.name }>
                <time
                  dateTime={ item.dateTime }
                  className="flex items-center text-sm font-semibold leading-6 text-blue-600"
                >
                  <svg viewBox="0 0 4 4" aria-hidden="true" className="mr-4 h-1 w-1 flex-none">
                    <circle r={ 2 } cx={ 2 } cy={ 2 } fill="currentColor" />
                  </svg>
                  { item.date }
                  <div
                    aria-hidden="true"
                    className="absolute -ml-2 h-px w-screen -translate-x-full bg-gray-900/10 sm:-ml-4 lg:static lg:-mr-6 lg:ml-8 lg:w-auto lg:flex-auto lg:translate-x-0" />
                </time>
                <p className="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900">{ item.name }</p>
                <p className="mt-1 text-base leading-7 text-gray-600">{ item.description }</p>
              </div>
            ) ) }
          </div>
        </div>

        {/* Logo cloud */ }
        <div className="mx-auto mt-32 max-w-7xl sm:mt-40 sm:px-6 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Trusted by leading event organizers
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              From small meetups to large-scale conferences, EventJacket has helped thousands of organizers create unforgettable experiences.
            </p>
            <div className="mx-auto mt-20 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-12 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 sm:gap-y-14 lg:max-w-4xl lg:grid-cols-5">
              {/* Replace with actual client logos */ }
              {/*<img src="/logos/client1.svg" alt="Client 1" className="col-span-2 max-h-12 w-full object-contain lg:col-span-1" />
    <img src="/logos/client2.svg" alt="Client 2" className="col-span-2 max-h-12 w-full object-contain lg:col-span-1" />
    <img src="/logos/client3.svg" alt="Client 3" className="col-span-2 max-h-12 w-full object-contain lg:col-span-1" />
    <img src="/logos/client4.svg" alt="Client 4" className="col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1" />
    <img src="/logos/client5.svg" alt="Client 5" className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1" />*/}
            </div>
            <div aria-hidden="true" className="absolute -top-24 right-0 -z-10 transform-gpu blur-3xl">
              <div
                style={ {
                  clipPath: 'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
                } }
                className="aspect-[1404/767] w-[87.75rem] bg-gradient-to-r from-[#80caff] to-[#1636ec] opacity-25" />
            </div>
          </div>
        </div>

        {/* Content section */ }
        <div className="mt-32 overflow-hidden sm:mt-40">
          <div className="mx-auto max-w-7xl px-6 lg:flex lg:px-8">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-12 gap-y-16 lg:mx-0 lg:min-w-full lg:max-w-none lg:flex-none lg:gap-y-8">
              <div className="lg:col-end-1 lg:w-full lg:max-w-lg lg:pb-8">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Mission</h2>
                <p className="mt-6 text-xl leading-8 text-gray-600">
                  EventJacket is on a mission to empower event organizers with tools that simplify planning, enhance attendee experiences, and drive success.
                </p>
                <p className="mt-6 text-base leading-7 text-gray-600">
                  We believe that great events have the power to inspire, connect, and transform. That's why we've built a platform that handles the complexities of event management, allowing organizers to focus on what truly matters: creating memorable moments.
                </p>
              </div>
              <div className="flex flex-wrap items-start justify-end gap-6 sm:gap-8 lg:contents">
                <div className="w-0 flex-auto lg:ml-auto lg:w-auto lg:flex-none lg:self-end">
                  <img
                    src="/images/team-collaboration.jpg"
                    alt="EventJacket team collaborating"
                    className="aspect-[7/5] w-[37rem] max-w-none rounded-2xl bg-gray-50 object-cover" />
                </div>
                <div className="contents lg:col-span-2 lg:col-end-2 lg:ml-auto lg:flex lg:w-[37rem] lg:items-start lg:justify-end lg:gap-x-8">
                  <div className="order-first flex w-64 flex-none justify-end self-end lg:w-auto">
                    <img
                      src="/images/event-analytics.jpg"
                      alt="Event analytics dashboard"
                      className="aspect-[4/3] w-[24rem] max-w-none flex-none rounded-2xl bg-gray-50 object-cover" />
                  </div>
                  <div className="flex w-96 flex-auto justify-end lg:w-auto lg:flex-none">
                    <img
                      src="/images/mobile-ticketing.jpg"
                      alt="Mobile ticketing feature"
                      className="aspect-[7/5] w-[37rem] max-w-none flex-none rounded-2xl bg-gray-50 object-cover" />
                  </div>
                  <div className="hidden sm:block sm:w-0 sm:flex-auto lg:w-auto lg:flex-none">
                    <img
                      src="/images/attendee-engagement.jpg"
                      alt="Attendee engagement features"
                      className="aspect-[4/3] w-[24rem] max-w-none rounded-2xl bg-gray-50 object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */ }
       
      </main>
    </div>
      <FooterFull />
    </>
  )
}