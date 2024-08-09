
import { fetchUserProfile } from '../../actions/fetchUserProfile';
import { SidebarProvider } from '../../../contexts/sidebar-context';
import { sidebarCookie } from '../../../lib/sidebar-cookie';
import type { PropsWithChildren } from 'react';
import { LayoutContent } from './layout-content';
import { DashboardNavbar } from './navbar';
import { DashboardSidebar } from './sidebar';
import { UserProvider } from '@/contexts/UserContext';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout ( { children }: PropsWithChildren<unknown> )
{
    const supabase = createClient();
    const {
        data: { session }
    } = await supabase.auth.getSession();

    if ( !session )
    {
        redirect( '/login' );
    }
    const user = await fetchUserProfile();
    return (
        <UserProvider user={ user }>
            <SidebarProvider initialCollapsed={ sidebarCookie.get().isCollapsed }>
                <DashboardNavbar />
                <div className="mt-16 flex items-start">
                    <DashboardSidebar />
                    <LayoutContent>{ children }</LayoutContent>
                </div>
            </SidebarProvider>
        </UserProvider>
    );
}
