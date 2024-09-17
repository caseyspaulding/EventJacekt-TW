'use client';

import  UserProvider  from '@/contexts/UserContext';
import DashboardLayoutTW from './components/DashboardLayoutTW/DashboardLayoutTW';
import type { UserType } from '@/types/UserType';
import React from 'react';

interface DashboardLayoutClientProps
{
  children: React.ReactNode;
  user: UserType | null;
}

export default function DashboardLayoutClient ( { children, user }: DashboardLayoutClientProps )
{
  // Check if user is properly initialized
  if ( user === undefined )
  {
    console.error( 'User is undefined, ensure UserProvider is initialized correctly' );
    return <div>Error: User context is not properly initialized.</div>;
  }
  
  return (
   
    <UserProvider initialUser={ user }>
      <DashboardLayoutTW>{ children }</DashboardLayoutTW>
      </UserProvider>
   
  );
}
