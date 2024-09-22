// app/layout.tsx
'use client';

import type { ReactNode } from 'react';
import Header from './Header'; // Import the Header component
import Sidebar, { SidebarItem } from './Sidebar';
import { Calendar, Flag, Home, Layers, LayoutDashboard, LifeBuoy, Settings, StickyNote } from 'lucide-react';
import { usePathname } from 'next/navigation';



interface LayoutProps
{
  children: ReactNode; // Define the type for children
}

export default function Layout ( { children }: LayoutProps )
{
  const pathname = usePathname();
  return (
    <div className="flex flex-col h-screen">
      {/* Header */ }
      

      {/* Main Content Area with Sidebar */ }
      <div className="flex flex-grow">
        {/* Sidebar */ }
        <Sidebar>
          {/* Navigation Items */ }
          <SidebarItem
            icon={ <LayoutDashboard size={ 20 } /> }
            text="Dashboard"
            active
            href="/dashboard"
            submenu={ [
              { text: 'Overview', href: '/dashboard/overview' },
              { text: 'Analytics', href: '/dashboard/analytics' },
            ] }
          />
          <SidebarItem icon={ <Home size={ 20 } /> } text="Home" active={ false } href="/test" />
          <SidebarItem icon={ <Settings size={ 20 } /> } text="Settings" active={ false } href="/test/settings" />
          <SidebarItem
            icon={ <LayoutDashboard size={ 20 } /> }
            text="Dashboard"
            href="/dashboard"
            active={ pathname === "/dashboard" }
          />
          <SidebarItem
            icon={ <StickyNote size={ 20 } /> }
            text="Projects"
            href="/projects"
            active={ pathname === "/projects" }
          />
          <SidebarItem
            icon={ <Calendar size={ 20 } /> }
            text="Calendar"
            href="/calendar"
            active={ pathname === "/calendar" }
          />
          <SidebarItem
            icon={ <Layers size={ 20 } /> }
            text="Tasks"
            href="/tasks"
            active={ pathname === "/tasks" }
          />
          <SidebarItem
            icon={ <Flag size={ 20 } /> }
            text="Reporting"
            href="/reporting"
            active={ pathname === "/reporting" }
          />
          <hr className="my-3" />
          <SidebarItem
            icon={ <Settings size={ 20 } /> }
            text="Settings"
            href="/test/settings"
            active={ pathname === "/settings" }
          />
          <SidebarItem
            icon={ <LifeBuoy size={ 20 } /> }
            text="Help"
            href="/help"
            active={ pathname === "/help" }
          />
        </Sidebar>

        {/* Main Content */ }
        <main className="flex-grow ">
          <Header />
          <h2 className="font-bold text-lg mb-4">Main Content</h2>
          { children }
        </main>
      </div>
    </div>
  );
}