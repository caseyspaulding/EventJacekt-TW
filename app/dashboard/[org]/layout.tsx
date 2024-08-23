import { fetchUserProfile } from '../../actions/fetchUserProfile';

import type { PropsWithChildren } from 'react';

import { UserProvider } from '@/contexts/UserContext';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import DashboardLayoutTW from './components/DashboardLayoutTW/DashboardLayoutTW';


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

   
    return (

        <UserProvider user={ user }>
           <DashboardLayoutTW>
                { children }
            </DashboardLayoutTW>
        </UserProvider>
    );
}
