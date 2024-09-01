import { fetchUserProfile } from '../../actions/fetchUserProfile';

import type { PropsWithChildren } from 'react';

import { UserProvider } from '@/contexts/UserContext';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import DashboardLayoutTW from './components/DashboardLayoutTW/DashboardLayoutTW';


export default async function DashboardLayout ( { children }: PropsWithChildren<unknown> )
{
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    console.log( 'Supabase session:', session );

    if ( !session )
    {
        console.warn( 'No active session found, redirecting to login.' );
        redirect( '/login' );
    }

    const user = await fetchUserProfile();
    console.log( 'Fetched user profile:', user );

    const org = user?.orgName;
    if ( !org )
    {
        console.error( 'Organization not found for user:', user );
        return (
            <div>
                <h1>Error: Organization not found</h1>
                <p>It looks like your account is not associated with an organization. Please contact support or try logging in again.</p>
            </div>
        );
    }

    return (
        <UserProvider user={ user }>
            <DashboardLayoutTW>
                { children }
            </DashboardLayoutTW>
        </UserProvider>
    );
}