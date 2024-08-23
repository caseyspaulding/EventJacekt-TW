import { fetchUserProfile } from '../../actions/fetchUserProfile';

import type { PropsWithChildren } from 'react';

import { UserProvider } from '@/contexts/UserContext';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Layout from './components/SidebarTW/LayoutTW';

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
    const org = user?.orgName
    if ( !org )
    {
        return <div>Error: Organization not found</div>; // Or some other error handling
    }

    if ( !user.role || !user.avatar )
    {
        // Assign default values if these properties are missing
        user.role = user.role || 'User';  // or some default role
        user.avatar = user.avatar || '/images/avatars/user_avatar_default.png';  // or some default avatar
    }
    return (

        <UserProvider user={ user }>
            <Layout>
                { children }
            </Layout>
        </UserProvider>
    );
}
