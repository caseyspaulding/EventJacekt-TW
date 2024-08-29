// app/layout.tsx
'use client';

import React, { ReactNode } from 'react'; // Import ReactNode for typing
import Header from './Header'; // Import the Header component
import Sidebar from './Sidebar'; // Import the Sidebar component

interface LayoutProps
{
  children: ReactNode; // Define the type for children
}

export default function Example ( { children }: LayoutProps )
{
  return (
    <div className="flex flex-col h-screen">
      {/* Header */ }
      <Header />

      {/* Main Content Area with Sidebar */ }
      <div className="flex flex-grow">
        {/* Sidebar */ }
        <Sidebar />

        {/* Main Content */ }
        <main className="flex-grow p-8">
          <h2 className="font-bold text-lg mb-4">Main Content</h2>
          { children }
        </main>
      </div>
    </div>
  );
}