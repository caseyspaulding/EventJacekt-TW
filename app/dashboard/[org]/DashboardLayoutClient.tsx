
'use client';

import { UserProvider } from '@/contexts/UserContext';
import DashboardLayoutTW from './components/DashboardLayoutTW/DashboardLayoutTW';

import type { UserType } from '@/types/UserType';

interface DashboardLayoutClientProps
{
  children: React.ReactNode;
  user: UserType | null;
}

export default function DashboardLayoutClient ( { children, user }: DashboardLayoutClientProps )
{
  return (
    <UserProvider user={ user }>
      <DashboardLayoutTW>{ children }</DashboardLayoutTW>
    </UserProvider>
  );
}
