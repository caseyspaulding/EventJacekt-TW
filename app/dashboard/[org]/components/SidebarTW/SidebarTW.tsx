'use client';

import { useState } from 'react';
import
{
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from '@headlessui/react';
import
{
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { useUser } from '@/contexts/UserContext'; // Import your useUser hook


const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon, current: false },
  { name: 'Create Event', href: '/events/new', icon: FolderIcon, current: false },
 
  { name: 'Banking', href: '/banking', icon: DocumentDuplicateIcon, current: false },
  { name: 'Calendar', href: '/calendar', icon: CalendarIcon, current: false },
  { name: 'Reports', href: '/reports', icon: ChartPieIcon, current: false },
  { name: 'Team', href: '/team', icon: UsersIcon, current: false },
];

const teams = [
  { id: 1, name: 'Docs', href: '/docs', initial: 'H', current: false },
  { id: 2, name: 'Support', href: '/support', initial: 'T', current: false },
  { id: 3, name: 'Feature Request', href: '/feature-request', initial: 'W', current: false },
];

const userNavigation = [
  { name: 'Your profile', href: '/profile' },
  { name: 'Sign out', href: '/sign-out' },
];

function classNames ( ...classes: string[] )
{
  return classes.filter( Boolean ).join( ' ' );
}

export default function Sidebar ()
{
  const [ sidebarOpen, setSidebarOpen ] = useState( false );
  const { user } = useUser(); // Get the user object from the context
  const orgName = user?.orgName; // Extract orgName from user

  const generateHref = ( href: string ) =>
  {
    return orgName ? `/dashboard/${ orgName }${ href }` : href;
  };

  return (
    <>
      {/* Dialog for mobile sidebar */ }
      <Dialog open={ sidebarOpen } onClose={ setSidebarOpen } className="relative z-50 lg:hidden">
        <DialogBackdrop className="fixed inset-0 bg-gray-900/80" />
        <div className="fixed inset-0 flex">
          <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1">
            <TransitionChild>
              <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                <button type="button" onClick={ () => setSidebarOpen( false ) } className="-m-2.5 p-2.5">
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon aria-hidden="true" className="h-6 w-6 text-white" />
                </button>
              </div>
            </TransitionChild>
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-blue-600 px-6 pb-4">
              <div className="flex h-16 shrink-0 items-center">
                <img alt="EventJacket" src="/images/logo.svg" className="h-8 w-auto" />
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      { navigation.map( ( item ) => (
                        <li key={ item.name }>
                          <a
                            href={ generateHref( item.href ) } // Generate dynamic href
                            className={ classNames(
                              item.current ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-700 hover:text-white',
                              'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                            ) }
                          >
                            <item.icon
                              aria-hidden="true"
                              className={ classNames(
                                item.current ? 'text-white' : 'text-blue-200 group-hover:text-white',
                                'h-6 w-6 shrink-0'
                              ) }
                            />
                            { item.name }
                          </a>
                        </li>
                      ) ) }
                    </ul>
                  </li>
                  <li>
                    <div className="text-xs font-semibold leading-6 text-blue-200">Other Resources</div>
                    <ul role="list" className="-mx-2 mt-2 space-y-1">
                      { teams.map( ( team ) => (
                        <li key={ team.name }>
                          <a
                            href={ generateHref( team.href ) } // Generate dynamic href
                            className={ classNames(
                              team.current ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-700 hover:text-white',
                              'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                            ) }
                          >
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-blue-400 bg-blue-500 text-[0.625rem] font-medium text-white">
                              { team.initial }
                            </span>
                            <span className="truncate">{ team.name }</span>
                          </a>
                        </li>
                      ) ) }
                    </ul>
                  </li>
                  <li className="mt-auto">
                    <a
                      href={ generateHref( '/settings' ) } // Generate dynamic href for settings
                      className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-blue-200 hover:bg-blue-700 hover:text-white"
                    >
                      <Cog6ToothIcon
                        aria-hidden="true"
                        className="h-6 w-6 shrink-0 text-blue-200 group-hover:text-white"
                      />
                      Settings
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Static sidebar for desktop */ }
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-blue-600 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <img alt="EventJacket" src="/images/logo.svg" className="h-8 w-auto" />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  { navigation.map( ( item ) => (
                    <li key={ item.name }>
                      <a
                        href={ generateHref( item.href ) } // Generate dynamic href
                        className={ classNames(
                          item.current ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-700 hover:text-white',
                          'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                        ) }
                      >
                        <item.icon
                          aria-hidden="true"
                          className={ classNames(
                            item.current ? 'text-white' : 'text-blue-200 group-hover:text-white',
                            'h-6 w-6 shrink-0'
                          ) }
                        />
                        { item.name }
                      </a>
                    </li>
                  ) ) }
                </ul>
              </li>
              <li>
                <div className="text-xs font-semibold leading-6 text-blue-200">Your teams</div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  { teams.map( ( team ) => (
                    <li key={ team.name }>
                      <a
                        href={ generateHref( team.href ) } // Generate dynamic href
                        className={ classNames(
                          team.current ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-700 hover:text-white',
                          'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                        ) }
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-blue-400 bg-blue-500 text-[0.625rem] font-medium text-white">
                          { team.initial }
                        </span>
                        <span className="truncate">{ team.name }</span>
                      </a>
                    </li>
                  ) ) }
                </ul>
              </li>
              <li className="mt-auto">
                <a
                  href={ generateHref( '/settings' ) } // Generate dynamic href for settings
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-blue-200 hover:bg-blue-700 hover:text-white"
                >
                  <Cog6ToothIcon
                    aria-hidden="true"
                    className="h-6 w-6 shrink-0 text-blue-200 group-hover:text-white"
                  />
                  Settings
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button type="button" onClick={ () => setSidebarOpen( true ) } className="-m-2.5 p-2.5 text-gray-700 lg:hidden">
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>

          {/* Separator */ }
          <div aria-hidden="true" className="h-6 w-px bg-gray-900/10 lg:hidden" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <form action="#" method="GET" className="relative flex flex-1">
              <label htmlFor="search-field" className="sr-only">
                Search
              </label>
              <MagnifyingGlassIcon
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
              />
              <input
                id="search-field"
                name="search"
                type="search"
                placeholder="Search..."
                className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
              />
            </form>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                <span className="sr-only">View notifications</span>
                <BellIcon aria-hidden="true" className="h-6 w-6" />
              </button>

              {/* Separator */ }
              <div aria-hidden="true" className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" />

              {/* Profile dropdown */ }
              <Menu as="div" className="relative">
                <MenuButton className="-m-1.5 flex items-center p-1.5">
                  <span className="sr-only">Open user menu</span>
                  <img
                    alt="user avatar"
                    src={ user?.avatar || '/images/avatars/user_avatar_default.png' }
                    className="h-8 w-8 rounded-full bg-gray-50"
                  />
                  <span className="hidden lg:flex lg:items-center">
                    <span aria-hidden="true" className="ml-4 text-sm font-semibold leading-6 text-gray-900">
                      { user?.email || 'No email found.' }
                    </span>
                    <ChevronDownIcon aria-hidden="true" className="ml-2 h-5 w-5 text-gray-400" />
                  </span>
                </MenuButton>
                <MenuItems
                  className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none"
                >
                  { userNavigation.map( ( item ) => (
                    <MenuItem key={ item.name }>
                      <a
                        href={ generateHref( item.href ) } // Generate dynamic href
                        className="block px-3 py-1 text-sm leading-6 text-gray-900"
                      >
                        { item.name }
                      </a>
                    </MenuItem>
                  ) ) }
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{/* Your content */ }</div>
        </main>
      </div>
    </>
  );
}
