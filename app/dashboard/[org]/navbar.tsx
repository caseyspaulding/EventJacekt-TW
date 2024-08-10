'use client';

import { useSidebarContext } from '../../../contexts/sidebar-context';
import { useMediaQuery } from '../../../hooks/use-media-query';
import { SupabaseClient } from '@supabase/supabase-js';
import
    {
        Avatar,
        DarkThemeToggle,
        Dropdown,
        Label,
        Navbar,
        TextInput,
        Tooltip
    } from 'flowbite-react';
import Image from 'next/image';
import Link from 'next/link';
import { Cog8ToothIcon, CogIcon, CurrencyDollarIcon, PresentationChartBarIcon, SquaresPlusIcon, TicketIcon, UserCircleIcon, UserIcon, UsersIcon, XMarkIcon } from '@heroicons/react/24/outline';
import UserDropdown from './components/UserDropdownDash';
import { ArchiveBoxIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Bars3CenterLeftIcon, EnvelopeOpenIcon } from '@heroicons/react/20/solid';


export function DashboardNavbar ()
{


    const sidebar = useSidebarContext();
    const isDesktop = useMediaQuery( '(min-width: 1024px)' );

    function handleToggleSidebar ()
    {
        if ( isDesktop )
        {
            sidebar.desktop.toggle();
        } else
        {
            sidebar.mobile.toggle();
        }
    }

    return (
        <Navbar
            fluid
            className="fixed top-0 z-30 w-full border-b border-gray-200 bg-white p-0 dark:border-gray-700 dark:bg-gray-800 sm:p-0"
        >
            <div className="w-full p-3 pr-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <button
                            onClick={ handleToggleSidebar }
                            className="mr-3 cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                            <span className="sr-only">Toggle sidebar</span>
                            {/* mobile */ }
                            <div className="lg:hidden">
                                { sidebar.mobile.isOpen ? (
                                    <XMarkIcon className="h-6 w-6" />
                                ) : (
                                        <Bars3CenterLeftIcon className="h-6 w-6" />
                                ) }
                            </div>
                            {/* desktop */ }
                            <div className="hidden lg:block">
                                <Bars3CenterLeftIcon className="h-6 w-6" />
                            </div>
                        </button>
                        <Navbar.Brand as={ Link } href="/" className="mr-14">
                            <Image
                                className="mr-1 h-8"
                                alt=""
                                src="/images/logo.svg"
                                width={ 32 }
                                height={ 32 }
                            />
                            <span className="self-center whitespace-nowrap text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent">
                                EventJacket
                            </span>
                        </Navbar.Brand>
                    </div>
                    <div className="flex items-center lg:gap-3">
                        <div className="flex items-center">
                            <AppDrawerDropdown />
                            <div className="hidden dark:block">
                                <Tooltip content="Toggle light mode">
                                    <DarkThemeToggle />
                                </Tooltip>
                            </div>
                            <div className="dark:hidden">
                                <Tooltip content="Toggle dark mode">
                                    <DarkThemeToggle />
                                </Tooltip>
                            </div>
                            <div className="ml-3 flex items-center">
                                <UserDropdown />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Navbar>
    );
}



function AppDrawerDropdown ()
{
    return (
        <Dropdown
            className="rounded"
            arrowIcon={ false }
            inline
            label={
                <span className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    <span className="sr-only">Apps</span>
                    <SquaresPlusIcon className="h-6 w-6" />
                </span>
            }
            theme={ { content: 'py-0' } }
        >
            <div className="block border-b bg-gray-50 px-4 py-2 text-center text-base font-medium text-gray-700 dark:border-b-gray-600 dark:bg-gray-700 dark:text-gray-400">
                Apps
            </div>
            <div className="grid grid-cols-3 gap-4 p-4">
                <Link
                    href="#"
                    className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                    <PresentationChartBarIcon className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-gray-400" />
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Sales</div>
                </Link>
                <Link
                    href="#"
                    className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                    <UsersIcon className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-gray-400" />
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Users</div>
                </Link>
                <Link
                    href="/"
                    className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                    <EnvelopeOpenIcon className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-gray-400" />
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Inbox</div>
                </Link>
                <Link
                    href="#"
                    className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                    <UserCircleIcon className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-gray-400" />
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Profile</div>
                </Link>
                <Link
                    href="#"
                    className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                    <CogIcon className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-gray-400" />
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Settings
                    </div>
                </Link>
                <Link
                    href="#"
                    className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                    <ArchiveBoxIcon className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-gray-400" />
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Products
                    </div>
                </Link>
                <Link
                    href="#"
                    className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                    <CurrencyDollarIcon className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-gray-400" />
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Pricing</div>
                </Link>
                <Link
                    href="#"
                    className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                    <TicketIcon className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-gray-400" />
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Billing</div>
                </Link>
                <Link
                    href="#"
                    className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                    <ArrowLeftIcon className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-gray-400" />
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Logout</div>
                </Link>
            </div>
        </Dropdown>
    );
}
<UserDropdown />    


//function UserDropdown ()
//{
//    return (
//        <Dropdown
//            className="rounded"
//            arrowIcon={ false }
//            inline
//            label={
//                <span>
//                    <span className="sr-only">User menu</span>
//                    <Avatar alt="" img="/images/avatars/user-avatar.jpg" rounded size="sm" />
//                </span>
//            }
//        >
//            <Dropdown.Header className="px-4 py-3">
//                <span className="block text-sm">Neil Sims</span>
//                <span className="block truncate text-sm font-medium">neil.sims@flowbite.com</span>
//            </Dropdown.Header>
//            <Dropdown.Item>Dashboard</Dropdown.Item>
//            <Dropdown.Item>Settings</Dropdown.Item>
//            <Dropdown.Item>Earnings</Dropdown.Item>
//            <Dropdown.Divider />
//            <Dropdown.Item>Sign out</Dropdown.Item>
//        </Dropdown>
//    );
//}
