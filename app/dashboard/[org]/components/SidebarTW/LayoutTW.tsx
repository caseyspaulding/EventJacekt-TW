'use client'; 

import type { ReactNode } from 'react';
import Sidebar from './SidebarTW';
interface LayoutProps
{
  children: ReactNode;
}
export default function Layout ( { children }: LayoutProps )
{
  return (
    <div>
      <Sidebar />
      <div className="lg:pl-72">
        { children }
      </div>
    </div>
  );
}