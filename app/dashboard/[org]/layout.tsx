// app/dashboard/layout.tsx
import { fetchUserProfile } from '../../actions/fetchUserProfile';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import DashboardLayoutClient from './DashboardLayoutClient'; // Import the client component wrapper

export default async function DashboardLayout ( { children }: React.PropsWithChildren<unknown> )
{
    const supabase = createClient();
    const {
        data: { session }
    } = await supabase.auth.getSession();

    if ( !session )
    {
        console.warn( 'No active session found, redirecting to login.' );
        redirect( '/login' );
        return null; // Safeguard in case redirect fails
    }

    console.log( 'Supabase session:', session );

    const user = await fetchUserProfile();
    console.log( 'Fetched user profile:', user );

    const org = user?.orgName;
    if ( !org )
    {
        console.error( 'Organization not found for user:', user );
        return (
            <div>
                <h1>Error: Organization not found</h1>
                <p>
                    It looks like your account is not associated with an organization. Please contact support or try logging in
                    again.
                </p>
            </div>
        );
    }

    // Pass the user data down to the client component
    return <DashboardLayoutClient user={ user }>{ children }</DashboardLayoutClient>;
}
