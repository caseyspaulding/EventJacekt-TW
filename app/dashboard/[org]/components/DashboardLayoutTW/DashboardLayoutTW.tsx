'use client';

import { useState } from 'react';
import { Disclosure, Dialog, Transition, Menu } from '@headlessui/react';
import { useUser } from '@/contexts/UserContext'; // Custom hook for user context
import type { ReactNode } from 'react';
import React from 'react';
import
{
  BanknotesIcon,
  Bars3CenterLeftIcon,
  ChevronRightIcon,
  FolderIcon,
  HomeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { signOut } from '@/app/actions/SignOut';




const navigation = [
  { name: 'Dashboard', href: '#', icon: HomeIcon, current: false },
  {
    name: 'Events',
    icon: FolderIcon,
    current: false,
    children: [
      { name: 'All Events', href: '/events' },
      { name: 'Create Event', href: '/events/new' },
      { name: 'Scan Tickets', href: '/events/scan-tickets' },
    ],
  },
  { name: 'Banking', href: '/banking', icon: BanknotesIcon, current: false },
];

const userNavigation = [
  { name: 'Your profile', href: '/profile' },
  { name: 'Sign out', href: '/sign-out' },
];

function classNames ( ...classes: string[] )
{
  return classes.filter( Boolean ).join( ' ' );
}

interface DashboardLayoutProps
{
  children: ReactNode;
}

export default function DashboardLayoutTW ( { children }: DashboardLayoutProps )
{
  const [ sidebarOpen, setSidebarOpen ] = useState( false );
  const { user } = useUser(); // Fetch user data from context
  const orgName = user?.orgName;

  const generateHref = ( href: string ) => ( orgName ? `/dashboard/${ orgName }${ href }` : href );

  return (
    <>
      {/* Mobile Sidebar */ }
      <Transition.Root show={ sidebarOpen } as={ React.Fragment }>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={ setSidebarOpen }>
          <Transition.Child
            as={ React.Fragment }
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 flex z-40">
            <Transition.Child
              as={ React.Fragment }
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-full bg-blue-600">
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:bg-blue-600"
                    onClick={ () => setSidebarOpen( false ) }
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                  <div className="flex-shrink-0 flex items-center  px-4">
                    <Link href="/">
                      <img
                        className="h-8 w-auto"
                        src="/images/logo.svg"
                        alt="EventJacket"
                      />
                    </Link>
                    <Link href="/">
                      <span className="pl-2 font-semibold text-white">
                        { orgName }
                      </span>
                    </Link>
                  </div>
                  <nav className="mt-5 px-2 space-y-1">
                    { navigation.map( ( item ) =>
                      !item.children ? (
                        <a
                          key={ item.name }
                          href={ generateHref( item.href ) }
                          className={ classNames(
                            item.current ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-700 hover:text-white',
                            'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                          ) }
                        >
                          <item.icon
                            className="mr-3 flex-shrink-0 h-6 w-6 text-blue-200"
                            aria-hidden="true"
                          />
                          { item.name }
                        </a>
                      ) : (
                        <Disclosure as="div" key={ item.name } className="space-y-1">
                          { ( { open } ) => (
                            <>
                              <Disclosure.Button
                                className={ classNames(
                                  item.current ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-700 hover:text-white',
                                  'group flex items-center w-full rounded-md p-1 mx-1 text-left text-base font-medium leading-6'
                                ) }
                              >
                                <div className="flex items-center gap-x-3">
                                  <item.icon
                                    aria-hidden="true"
                                    className="h-6 w-6 text-blue-100"
                                  />
                                  { item.name }
                                </div>
                                <ChevronRightIcon
                                  aria-hidden="true"
                                  className={ classNames(
                                    open ? 'rotate-90 transform' : '',
                                    'ml-auto h-5 w-5 text-blue-100 group-hover:text-white'
                                  ) }
                                />
                              </Disclosure.Button>
                              <Disclosure.Panel className="space-y-1">
                                { item.children.map( ( subItem ) => (
                                  <Disclosure.Button
                                    key={ subItem.name }
                                    as="a"
                                    href={ generateHref( subItem.href ) }
                                    className="group flex items-center pl-10 pr-3 py-2 text-sm font-medium text-blue-100 hover:bg-blue-700 hover:text-white rounded-md"
                                  >
                                    { subItem.name }
                                  </Disclosure.Button>
                                ) ) }
                              </Disclosure.Panel>
                            </>
                          ) }
                        </Disclosure>
                      )
                    ) }
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop Sidebar */ }
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-blue-600 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <Link href="/">
              <img
                className="h-8 w-auto"
                src="/images/logo.svg"
                alt="EventJacket"
              />
            </Link>
            <Link href="/">
              <span className="pl-2 font-extrabold text-white">
                { orgName }
              </span>
            </Link>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            { navigation.map( ( item ) =>
              !item.children ? (
                <a
                  key={ item.name }
                  href={ generateHref( item.href ) }
                  className={ classNames(
                    item.current ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-700 hover:text-white',
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                  ) }
                >
                  <item.icon
                    className="mr-3 flex-shrink-0 h-6 w-6 text-blue-100"
                    aria-hidden="true"
                  />
                  { item.name }
                </a>
              ) : (
                <Disclosure as="div" key={ item.name } className="space-y-1">
                  { ( { open } ) => (
                    <>
                      <Disclosure.Button
                        className={ classNames(
                          item.current ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-700 hover:text-white',
                          'group flex items-center w-full rounded-md p-2 text-left text-sm font-semibold leading-6'
                        ) }
                      >
                        <div className="flex items-center gap-x-3">
                          <item.icon
                            aria-hidden="true"
                            className="h-6 w-6 text-blue-100"
                          />
                          { item.name }
                        </div>
                        <ChevronRightIcon
                          aria-hidden="true"
                          className={ classNames(
                            open ? 'rotate-90 transform' : '',
                            'ml-auto h-5 w-5 text-blue-100 group-hover:text-white'
                          ) }
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="space-y-1">
                        { item.children.map( ( subItem ) => (
                          <Disclosure.Button
                            key={ subItem.name }
                            as="a"
                            href={ generateHref( subItem.href ) }
                            className="group flex items-center pl-10 pr-2 py-2 text-sm font-medium text-blue-100 hover:bg-blue-700 hover:text-white rounded-md"
                          >
                            { subItem.name }
                          </Disclosure.Button>
                        ) ) }
                      </Disclosure.Panel>
                    </>
                  ) }
                </Disclosure>
              )
            ) }
          </nav>
        </div>
      </div>

      <div className="flex flex-col flex-1 lg:pl-64">
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-blue-600 ">
          <button
            type="button"
            className="px-4   text-gray-100 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-blue-500 lg:hidden"
            onClick={ () => setSidebarOpen( true ) }
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3CenterLeftIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="relative w-full text-blue-400 focus-within:text-blue-600">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none"></div>
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {/* Profile dropdown */ }
              <Menu as="div" className="ml-3 relative">
                <div>
                  <Menu.Button className="max-w-xs z-50 bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src={ user?.avatar || '/images/avatars/user_avatar_default.png' }
                      alt=""
                    />
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
                            // Use a form to trigger the signOut server action
                            <form action={ signOut } method="post" className="w-full">
                              <button
                                type="submit"
                                className={ classNames(
                                  active ? 'bg-gray-100' : '',
                                  'w-full text-left px-4 py-2 text-sm text-gray-700'
                                ) }
                              >
                                { item.name }
                              </button>
                            </form>
                          ) : (
                            <a
                              href={ generateHref( item.href ) }
                              className={ classNames(
                                active ? 'bg-gray-100' : '',
                                'block w-full px-4 py-2 text-sm text-gray-700'
                              ) }
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
          </div>
        </div>
        
        <main>
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"> {/* Render children here */ }
          
            { children }
            {/* /End replace */ }</div>
        </main>
        
      </div>
    </>
  );
}
