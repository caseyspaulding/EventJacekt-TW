/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useSidebarContext } from '../../../contexts/sidebar-context';
import {  Sidebar,  Tooltip } from 'flowbite-react';
import Link from 'next/link';
import { redirect, usePathname } from 'next/navigation';
import type { ComponentProps, FC } from 'react';
import { useEffect, useState } from 'react';

import { twMerge } from 'tailwind-merge';
import { useUser } from '@/contexts/UserContext';
import type { HTMLAttributeAnchorTarget } from 'react';
import {
    BanknotesIcon,
   
    CalculatorIcon,
   
    CalendarDateRangeIcon,
   
    ClipboardIcon,
    CogIcon,
    EnvelopeOpenIcon,
    QrCodeIcon,
    TableCellsIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline';
import {
    ClipboardDocumentIcon,
    QuestionMarkCircleIcon,
    TicketIcon
} from '@heroicons/react/20/solid';
import { Dashboard, FolderPlus } from 'tabler-icons-react';

interface SidebarItem {
    href?: string;
    target?: HTMLAttributeAnchorTarget;
    icon?: FC<ComponentProps<'svg'>>;
    label: string;
    items?: SidebarItem[];
    badge?: string;
}

interface SidebarItemProps extends SidebarItem {
    pathname: string;
}

interface DashboardSidebarProps {
    orgName: string;
    pathname: string;
}

export function DashboardSidebar() {
    const { user } = useUser();

    const orgName = user?.orgName; // Get orgName from context
    const pathname = usePathname();

    if (!user) {
        // Handle case where user data is not available, maybe show a loading indicator
        return null;
    }

    if (orgName === undefined) {
        redirect('/login');
    }

    return (
        <>
            <div className="lg:hidden">
                <MobileSidebar orgName={orgName} pathname={pathname} />
            </div>
            <div className="hidden lg:block">
                <DesktopSidebar orgName={orgName} pathname={pathname} />
            </div>
        </>
    );
}

function DesktopSidebar({ orgName, pathname }: DashboardSidebarProps) {
    const { isCollapsed, setCollapsed } = useSidebarContext().desktop;
    const [isPreview, setIsPreview] = useState(isCollapsed);

    useEffect(() => {
        if (isCollapsed) setIsPreview(false);
    }, [isCollapsed]);

    const preview = {
        enable() {
            if (!isCollapsed) return;

            setIsPreview(true);
            setCollapsed(false);
        },
        disable() {
            if (!isPreview) return;

            setCollapsed(true);
        }
    };

    return (
        <Sidebar
            onMouseEnter={preview.enable}
            onMouseLeave={preview.disable}
            aria-label="Sidebar"
            collapsed={isCollapsed}
            className={twMerge(
                'fixed inset-y-0 left-0 z-20 flex h-full shrink-0 flex-col border-r   border-blue-200 pt-16 duration-75 dark:border-blue-700 lg:flex',
                isCollapsed && 'hidden w-16'
            )}
            id="sidebar"
        >
            <div className="flex h-full flex-col justify-between  ">
                <div className="py-2  ">
                    <Sidebar.Items>
                        <Sidebar.ItemGroup className="mt-0 border-t-0 pb-1 pt-0">
                            {pages.map((item) => (
                                <SidebarItem key={item.label} {...item} pathname={pathname} />
                            ))}
                        </Sidebar.ItemGroup>
                        <Sidebar.ItemGroup className="mt-2 pt-2">
                            {externalPages.map((item) => (
                                <SidebarItem key={item.label} {...item} pathname={pathname} />
                            ))}
                        </Sidebar.ItemGroup>
                    </Sidebar.Items>
                </div>
                <BottomMenu isCollapsed={isCollapsed} />
            </div>
        </Sidebar>
    );
}

function MobileSidebar({ orgName, pathname }: DashboardSidebarProps) {
    const { isOpen, close } = useSidebarContext().mobile;

    if (!isOpen) return null;

    return (
        <>
            <Sidebar
                aria-label="Sidebar with multi-level dropdown"
                className={twMerge(
                    'fixed inset-y-0 left-0 z-20 hidden h-full shrink-0 flex-col border-r  border-blue-200 pt-16 dark:border-blue-700 lg:flex',
                    isOpen && 'flex'
                )}
                id="sidebar"
            >
                <div className="flex h-full flex-col justify-between">
                    <div className="py-2">
                        <Sidebar.Items>
                            <Sidebar.ItemGroup className="mt-0 border-t-0 pb-1 pt-0">
                                {pages.map((item) => (
                                    <SidebarItem key={item.label} {...item} pathname={pathname} />
                                ))}
                            </Sidebar.ItemGroup>
                            <Sidebar.ItemGroup className="mt-2 pt-2">
                                {externalPages.map((item) => (
                                    <SidebarItem key={item.label} {...item} pathname={pathname} />
                                ))}
                            </Sidebar.ItemGroup>
                        </Sidebar.Items>
                    </div>
                    <BottomMenu isCollapsed={false} />
                </div>
            </Sidebar>
            <div
                onClick={close}
                aria-hidden="true"
                className="fixed inset-0 z-10 h-full w-full bg-blue-900/50 pt-16 dark:bg-blue-900/90"
            />
        </>
    );
}

function SidebarItem({ href, target, icon, label, items, badge, pathname }: SidebarItemProps) {
    const { user } = useUser();
    const orgName = user?.orgName;
    const { close } = useSidebarContext().mobile; // Access the close function from the mobile sidebar context

    const handleClick = () => {
        if (close) close(); // Close the sidebar if the close function is available
    };

    if (items) {
        const isOpen = items.some((item: SidebarItem) =>
            pathname.startsWith(`/dashboard/${orgName}${item.href}`)
        );

        return (
            <Sidebar.Collapse
                icon={icon}
                label={label}
                open={isOpen}
                theme={{ list: 'space-y-2 py-2  [&>li>div]:w-full' }}
            >
                {items.map((item: SidebarItem) => (
                    <Sidebar.Item
                        key={item.label}
                        as={Link}
                        href={`/dashboard/${orgName}${item.href}`}
                        target={item.target}
                        className={twMerge(
                            'justify-center [&>*]:font-normal',
                            pathname === item.href && 'bg-blue-700 text-blue-600 dark:bg-blue-700'
                        )}
                        onClick={handleClick} // Close the sidebar when an item is clicked
                    >
                        {item.label}
                    </Sidebar.Item>
                ))}
            </Sidebar.Collapse>
        );
    }
    if (!href) {
        return null; // Return null if no href is provided and there are no items
    }
    const finalHref = target ? href : `/dashboard/${orgName}${href}`;
    return (
        <Sidebar.Item
            as={Link}
            href={finalHref}
            target={target}
            icon={icon}
            label={badge}
            className={twMerge(pathname === finalHref && 'bg-blue-200 dark:bg-blue-700')}
            onClick={handleClick} // Close the sidebar when an item is clicked
        >
            {label}
        </Sidebar.Item>
    );
}
function BottomMenu({ isCollapsed }: { isCollapsed: boolean }) {
    return (
        <div
            className={twMerge('flex items-center justify-center gap-4', isCollapsed && 'flex-col')}
        >
            <Tooltip content="Settings page">
                <Link
                    href="/users/settings"
                    className="inline-flex cursor-pointer justify-center rounded p-2 text-gray-800 hover:bg-blue-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                    <span className="sr-only">Settings page</span>
                    <CogIcon className="h-6  w-6" />
                </Link>
            </Tooltip>
            <div></div>
        </div>
    );
}

const pages: SidebarItem[] = [
    { href: '/', icon: Dashboard, label: 'Dashboard' },
    //{ href: '/kanban', icon: TableCellsIcon, label: 'Kanban' },
    //{ href: '/events/new', icon: TableCellsIcon, label: 'Create Event' },
    //{ href: '/mailing/inbox', icon: HiInboxIn, label: 'Inbox', badge: '3' },

    //{ href: '', icon: ClipboardDocumentIcon, label: 'Forms' },

    {
        icon: FolderPlus,
        label: 'Events',
        items: [
            { href: '/events/new', icon: CalendarDateRangeIcon, label: 'Create Event' },
            { href: '/events/scan-tickets', icon: QrCodeIcon, label: 'Scan Tickets' },
           
        ]
    },
    //{
    //    icon: TicketIcon,
    //    label: 'Tickets',
    //    items: [
    //        { href: '/e-commerce/products', label: 'Tickets' },
    //        { href: '/e-commerce/billing', label: 'Billing' },
    //        { href: '/e-commerce/invoice', label: 'Invoice' }
    //    ]
    //},
    {
        icon: BanknotesIcon,
        label: 'Banking',
        items: [
            { href: '/banking', label: 'Link Account' },
            { href: '/e-commerce/billing', label: 'Billing' },
            { href: '/e-commerce/invoice', label: 'Invoice' }
        ]
    },
    {
        icon: UserGroupIcon ,  
        label: 'Users',
        items: [
            { href: '/users/list', label: 'Users list' },
            { href: '/users/profile', label: 'Profile' },
            { href: '/users/feed', label: 'Feed' },
            { href: '/users/settings', label: 'Settings' }
        ]
    }
];

const externalPages: SidebarItem[] = [
    {
        href: '/docs',
        target: '_blank',
        icon: ClipboardIcon,
        label: 'Docs'
    },

    {
        href: '/support',
        target: '_blank',
        icon: QuestionMarkCircleIcon,
        label: 'Help'
    }
];
