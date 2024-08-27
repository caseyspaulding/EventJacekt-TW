'use client';

import { Menu, Popover, PopoverButton, PopoverGroup, PopoverPanel, Transition } from "@headlessui/react";
import { ChevronDownIcon, QrCodeIcon, XMarkIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Bars3CenterLeftIcon, BuildingStorefrontIcon, ChartBarIcon, HeartIcon, MegaphoneIcon } from "@heroicons/react/24/outline";
import { createClient } from "@/utils/supabase/client";
import React from "react";
import type { Json } from "@/database.types";
import { Button } from "@nextui-org/button";


// Define your UserType
export interface User
{
  id: string; // From auth.users
  email: string; // From auth.users
  orgName: string; // From userProfiles
  organizationId: string; // From userProfiles
  role: string; // From userProfiles or auth.users depending on your logic
  avatar: string; // From userProfiles or a default URL
  contactNumber?: string; // Optional field from userProfiles
  bio?: string; // Optional field from userProfiles
  socialLinks?: Record<string, string>; // Optional field from userProfiles
  isActive: boolean; // From userProfiles
  lastLogin?: Date; // Optional field from userProfiles
  permissions?: Record<string, boolean>; // Optional field from userProfiles
  preferences?: Record<string, Json>; // Optional field from userProfiles
  department?: string; // Optional field from userProfiles
  createdAt: Date; // From userProfiles
  updatedAt: Date; // From userProfiles
}




const solutions = [
  {
    name: "Ticketing",
    description: "Get a better understanding of where your traffic is coming from.",
    href: "/ticketing",
    icon: BuildingStorefrontIcon,
  },
  {
    name: "CRM",
    description: "Build and Maintain your relationships.",
    href: "/crm",
    icon: HeartIcon,
  },
  {
    name: "Marketing",
    description: "Get the word out.",
    href: "/marketing",
    icon: MegaphoneIcon,
  },
  {
    name: "Analytics",
    description: "Data you need to make the right decisions.",
    href: "/analytics",
    icon: ChartBarIcon,
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

  { name: "Guides", href: "/blog" },

];


export default function NavBar1 ()
{
  const [ isSticky, setIsSticky ] = useState( false );
  const [ isAuthenticated, setIsAuthenticated ] = useState( false );
  const [ user, setUser ] = useState<User | null>( null );
  const supabase = createClient();

  const fetchUserProfile = async () =>
  {
    try
    {
      const response = await fetch( '/api/userProfile', { method: 'GET' } );
      if ( response.ok )
      {
        const userProfile = await response.json();
        setUser( userProfile );
        setIsAuthenticated( true );
        return userProfile;
      } else
      {
        setUser( null );
        setIsAuthenticated( false );
        return null;
      }
    } catch ( error )
    {
      console.error( 'Error fetching user profile:', error );
      return null;
    }
  };

  useEffect( () =>
  {
    fetchUserProfile();
    const handleScroll = () => setIsSticky( window.scrollY > 0 );
    window.addEventListener( 'scroll', handleScroll );
    return () => window.removeEventListener( 'scroll', handleScroll );
  }, [] );

  const handleSignOut = async ( event: React.FormEvent<HTMLFormElement> ) =>
  {
    event.preventDefault();
    try
    {
      const { error } = await supabase.auth.signOut();
      if ( error ) throw error;
      setIsAuthenticated( false );
      setUser( null );
    } catch ( error )
    {
      console.error( 'Sign out error:', error );
    }
  };

  const userNavigation = [
    { name: 'Dashboard', href: user ? `/dashboard/${ user.orgName }` : '' }, // Dynamic link
    { name: 'Sign out', href: '#' },
  ];

  return (
    <div
      className={ `sticky top-0 z-50  shadow-sm  ${ isSticky ? 'bg-white ' : 'bg-white/60 backdrop-blur-none' }` }
    >
      <header>
        <Popover className="relative ">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-2 py-4 md:justify-start md:space-x-10 lg:px-2">
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
                <p className="ml-2 font-extrabold lg:mt-1 sm:mt-1 text-xl text-blue-700">
                  <span>EventJacket</span>
                </p>
              </Link>
            </div>
            <div className="-my-2 -mr-2 md:hidden">
              <PopoverButton className="relative inline-flex items-center justify-center rounded-md bg-transparent p-2 text-gray-700 hover:bg-blue-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open menu</span>
                <Bars3CenterLeftIcon aria-hidden="true" className="h-6 w-6" />
              </PopoverButton>
            </div>
            <PopoverGroup as="nav" className="hidden space-x-10 md:flex">
              {/* Solutions Popover */ }
              <Popover className="relative">
                <PopoverButton className="group inline-flex items-center rounded-md text-base font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 data-[open]:text-gray-900">
                  <span>Solutions</span>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="ml-2 h-5 w-5 text-gray-700 group-hover:text-gray-500 group-data-[open]:text-gray-600 group-data-[open]:group-hover:text-gray-500"
                  />
                </PopoverButton>

                <PopoverPanel className="absolute z-10 -ml-4 mt-3 w-screen max-w-md transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in lg:left-1/2 lg:ml-0 lg:max-w-2xl lg:-translate-x-1/2">
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
                            <p className="text-base font-medium text-gray-900">{ item.name }</p>
                            <p className="mt-1 text-sm text-gray-500">{ item.description }</p>
                          </div>
                        </a>
                      ) ) }
                    </div>
                  </div>
                </PopoverPanel>
              </Popover>

              {/* Navigation Links */ }
              { navigation.map( ( item ) => (
                <a key={ item.name } href={ item.href } className="text-base font-medium text-gray-500 hover:text-gray-900">
                  { item.name }
                </a>
              ) ) }
            </PopoverGroup>

            {/* User Profile or Sign in/Sign up */ }
            <div className="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
              { !isAuthenticated ? (
                <>
                  <a href="/login" className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900">
                    Sign in
                  </a>
                  <a
                    href="/signup"
                    className="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-3xl border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700"
                  >
                    Sign up
                  </a>
                </>
              ) : (
                  <Menu as="div" className="ml-3 relative bg-white/90 backdrop-blur-lg">
                  <div>
                    <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <span className="sr-only">Open user menu</span>
                      <div className="flex items-center space-x-4">
                        <img
                          className="h-8 w-8 rounded-full"
                          src={ user?.avatar || '/images/avatars/user_avatar_default.png' }
                          alt=""
                        />
                        {/* Container to stack the orgName and email vertically */ }
                        <div className="flex flex-col items-start">
                          <p className="text-base font-medium text-gray-900">{ user?.orgName }</p>
                          <p className="text-xs text-gray-500">{ user?.email }</p>
                        </div>
                      </div>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={ React.Fragment }
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      { userNavigation.map( ( item ) => (
                        <Menu.Item key={ item.name }>
                          { ( { active } ) =>
                            item.name === 'Sign out' ? (
                              <form onSubmit={ handleSignOut } method="post" className="w-full">
                                <button
                                  type="submit"
                                  className={ `${ active ? 'bg-gray-100' : ''
                                    } w-full text-left px-4 py-2 text-sm text-gray-700` }
                                >
                                  { item.name }
                                </button>
                              </form>
                            ) : (
                              <a
                                href={ item.href }
                                className={ `${ active ? 'bg-gray-100' : ''
                                  } block w-full px-4 py-2 text-sm text-gray-700` }
                              >
                                { item.name }
                              </a>
                            )
                          }
                        </Menu.Item>
                      ) ) }
                    </Menu.Items>
                  </Transition>
                </Menu>
              ) }
            </div>
          </div>


          {/* Mobile menu */ }
          <PopoverPanel className="absolute inset-x-0 top-0 z-30 origin-top-right p-2 transition data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-100 data-[enter]:ease-out data-[leave]:ease-in md:hidden">
            <div className="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="px-5 pb-6 pt-5">
                <div className="flex items-center justify-between">
                  <div>
                    <Image alt="EventJacket" height={ 40 } width={ 40 } src="/images/logo.svg" className="h-8 w-auto" />
                  </div>
                  <div className="-mr-2">
                    <PopoverButton className="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                    </PopoverButton>
                  </div>
                </div>

                {/* Conditional rendering based on authentication */ }
                { isAuthenticated ? (
                  <div className="flex flex-col mt-6 space-y-2">
                    {/* User profile dropdown for mobile */ }
                    <Menu as="div" className="relative">
                      <div>
                        <Menu.Button className="flex items-center rounded-md text-base font-medium text-gray-700 hover:text-gray-900">
                          <img
                            className="h-8 w-8 rounded-full"
                            src={ user?.avatar || '/images/avatars/user_avatar_default.png' }
                            alt=""
                          />
                          <div className="ml-2 flex flex-col items-start">
                            <span className="font-medium text-gray-900">{ user?.orgName || 'User' }</span>
                            <span className="text-sm text-gray-500">{ user?.email || 'user@example.com' }</span>
                          </div>
                        </Menu.Button>
                      </div>
                      <Transition
                        as={ React.Fragment }
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                          { userNavigation.map( ( item ) => (
                            <Menu.Item key={ item.name }>
                              { ( { active } ) =>
                                item.name === 'Sign out' ? (
                                  <form onSubmit={ handleSignOut } method="post" className="w-full">
                                    <button
                                      type="submit"
                                      className={ `${ active ? 'bg-gray-100' : ''
                                        } w-full text-left px-4 py-2 text-sm text-gray-700` }
                                    >
                                      { item.name }
                                    </button>
                                  </form>
                                ) : (
                                  <a
                                    href={ item.href }
                                    className={ `${ active ? 'bg-gray-100' : ''
                                      } block w-full px-4 py-2 text-sm text-gray-700` }
                                  >
                                    { item.name }
                                  </a>
                                )
                              }
                            </Menu.Item>
                          ) ) }
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                ) : (
                  <div className="mt-6">
                    <Button
                      as='a'
                      href="/signup"
                      className="flex w-full items-center rounded-3xl justify-center  border border-transparent bg-orange-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-orange-600"
                    >
                      Create Account
                    </Button>
                    <p className="mt-6 mr-2 text-center text-base font-medium text-gray-500">
                      Existing customer?
                      <Link href="/login" className="ml-2 underline text-orange-500">
                        Sign in
                      </Link>
                    </p>
                  </div>
                ) }

                {/* Solutions and additional links */ }
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
                        <div className="ml-4 text-base font-medium text-gray-900">{ item.name }</div>
                      </a>
                    ) ) }
                  </nav>
                </div>
              </div>

              {/* Navigation Links */ }
              <div className="px-5 py-6">
                <div className="grid grid-cols-2 gap-4">
                  { navigation.map( ( item ) => (
                    <a key={ item.name } href={ item.href } className="text-base font-medium text-gray-900 hover:text-gray-700">
                      { item.name }
                    </a>
                  ) ) }
                </div>
              </div>
            </div>
          </PopoverPanel>

        </Popover>
      </header>


    </div>
  );
}
