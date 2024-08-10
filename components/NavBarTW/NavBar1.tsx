'use client';

import { Popover, PopoverButton, PopoverGroup, PopoverPanel } from "@headlessui/react";
import { Bars3Icon, ChatBubbleBottomCenterTextIcon, ChatBubbleLeftRightIcon, ChevronDownIcon, CodeBracketIcon, InboxIcon, QrCodeIcon, QuestionMarkCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import AuthButton from "../AuthButton";

const solutions = [
  {
    name: "Ticketing",
    description:
      "Get a better understanding of where your traffic is coming from.",
    href: "/ticketing",
    icon: InboxIcon,
  },
  {
    name: "CRM",
    description: "Build and Maintain your relationships.",
    href: "/crm",
    icon: ChatBubbleBottomCenterTextIcon,
  },
  {
    name: "Marketing",
    description: "Get the word out.",
    href: "/marketing",
    icon: ChatBubbleLeftRightIcon,
  },
  {
    name: "Analytics",
    description: "Data you need to make the right decisions.",
    href: "/analytics",
    icon: QuestionMarkCircleIcon,
  },
  {
    name: "QR Code",
    description: "Free Custom QR Code Generator.",
    href: "/qrcode",
    icon: QrCodeIcon,
  },
];
const navigation = [
  { name: "Pricing", href: "/pricing" },
  { name: "FAQs", href: "/faqs" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
];
export default function NavBar1 ()
{
  const [ isSticky, setIsSticky ] = useState( false );

  useEffect( () =>
  {
    const handleScroll = () =>
    {
      if ( window.scrollY > 0 )
      {
        setIsSticky( true );
      } else
      {
        setIsSticky( false );
      }
    };

    window.addEventListener( 'scroll', handleScroll );

    return () =>
    {
      window.removeEventListener( 'scroll', handleScroll );
    };
  }, [] );
  return (
    <div
      className={ `sticky top-0 z-50 transition-all duration-300 ${ isSticky ? 'bg-white/70 backdrop-blur-lg' : 'bg-white/30 backdrop-blur-none'
        }` }
    >
      <header>
        <Popover className="relative bg-transparent">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:justify-start md:space-x-10 lg:px-8">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <Link href="/">
                <span className="sr-only">EventJacket</span>
                <Image
                  alt="Evenjacket logo"
                  height={ 40 }
                  width={ 40 }
                  src="/images/logo.svg"
                  className="h-8 w-auto sm:h-10"
                />
              </Link>
              <Link href="/">
                <p className="ml-2  font-extrabold lg:mt-1 sm:mt-1 text-xl text-blue-700 ">
                  <span>EventJacket</span>
                </p>
              </Link>
            </div>
            <div className="-my-2 -mr-2 md:hidden">
              <PopoverButton className="relative inline-flex items-center justify-center rounded-md bg-transparent p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open menu</span>
                <Bars3Icon aria-hidden="true" className="h-6 w-6" />
              </PopoverButton>
            </div>
            <PopoverGroup as="nav" className="hidden space-x-10 md:flex">
              <Popover className="relative">
                <PopoverButton className="group inline-flex items-center rounded-md  text-base font-medium text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 data-[open]:text-gray-900">
                  <span>Solutions</span>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="ml-2 h-5 w-5 text-gray-400 group-hover:text-gray-500 group-data-[open]:text-gray-600 group-data-[open]:group-hover:text-gray-500"
                  />
                </PopoverButton>

                <PopoverPanel
                  transition
                  className="absolute z-10 -ml-4 mt-3 w-screen max-w-md transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in lg:left-1/2 lg:ml-0 lg:max-w-2xl lg:-translate-x-1/2"
                >
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8 lg:grid-cols-2">
                      { solutions.map( ( item ) => (
                        <a
                          key={ item.name }
                          href={ item.href }
                          className="-m-3 flex items-start rounded-lg p-3 hover:bg-gray-50"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-600 text-white sm:h-12 sm:w-12">
                            <item.icon aria-hidden="true" className="h-6 w-6" />
                          </div>
                          <div className="ml-4">
                            <p className="text-base font-medium text-gray-900">
                              { item.name }
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              { item.description }
                            </p>
                          </div>
                        </a>
                      ) ) }
                    </div>
                  </div>
                </PopoverPanel>
              </Popover>

              { navigation.map( ( item ) => (
                <a
                  key={ item.name }
                  href={ item.href }
                  className="text-base font-medium text-gray-500 hover:text-gray-900"
                >
                  { item.name }
                </a>
              ) ) }
            </PopoverGroup>

            <div className="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
             
              <a
                href="/login"
                className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900"
              >
                Sign in
              </a>
              <a
                href="/signup"
                className="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700"
              >
                Sign up
              </a>
            </div>
          </div>

          <PopoverPanel
            transition
            className="absolute inset-x-0 top-0 z-30 origin-top-right p-2 transition data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-100 data-[enter]:ease-out data-[leave]:ease-in md:hidden"
          >
            <div className="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="px-5 pb-6 pt-5">
                <div className="flex items-center justify-between">
                  <div>
                    <Image
                      alt="EventJacket"
                      height={ 40 }
                      width={ 40 }
                      src="/images/logo.svg"
                      className="h-8 w-auto"
                    />
                  </div>
                  <div className="-mr-2">
                    <PopoverButton className="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                    </PopoverButton>
                  </div>
                </div>
                <div className="mt-6">
                  <nav className="grid grid-cols-1 gap-7">
                    { solutions.map( ( item ) => (
                      <a
                        key={ item.name }
                        href={ item.href }
                        className="-m-3 flex items-center rounded-lg p-3 hover:bg-gray-50"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-600 text-white">
                          <item.icon aria-hidden="true" className="h-6 w-6" />
                        </div>
                        <div className="ml-4 text-base font-medium text-gray-900">
                          { item.name }
                        </div>
                      </a>
                    ) ) }
                  </nav>
                </div>
              </div>
              <div className="px-5 py-6">
                <div className="grid grid-cols-2 gap-4">
                  { navigation.map( ( item ) => (
                    <a
                      key={ item.name }
                      href={ item.href }
                      className="text-base font-medium text-gray-900 hover:text-gray-700"
                    >
                      { item.name }
                    </a>
                  ) ) }
                </div>
                <div className="mt-6">
                  <a
                    href="/signup"
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700"
                  >
                    Sign up
                  </a>
                  <p className="mt-6 mr-2 text-center text-base font-medium text-gray-500">
                    Existing customer?
                    <Link href="/login" className=" ml-2 text-gray-900">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </PopoverPanel>
        </Popover>
      </header>
    </div>
  )
}