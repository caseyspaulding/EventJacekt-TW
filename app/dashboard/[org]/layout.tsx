// app/dashboard/layout.tsx
import { fetchUserProfile } from '../../actions/fetchUserProfile';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import DashboardLayoutClient from './DashboardLayoutClient'; // Import the client component wrapper
import Head from 'next/head';
import Script from 'next/script';

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

  

    // Fetch user profile safely
    let user = null;
    try
    {
        user = await fetchUserProfile();

    } catch ( error )
    {
        console.error( 'Error fetching user profile:', error );
        redirect( '/login' ); // Redirect in case of error fetching user
        return null;
    }

    if ( !user?.orgName )
    {
        console.error( 'Organization not found for user:', user );
        return (
            <div>
                <h1>Error: Organization not found</h1>
                <p>
                    It looks like your account is not associated with an organization. Please contact support or try logging in again.
                </p>
            </div>
        );
    }

    // Pass the user data down to the client component
    return ( <>
        <Head>
            <title>{ user.orgName } Dashboard</title>
            <Script src="https://connect.stripe.com/connect-js" defer></Script>
        
        </Head>

    <DashboardLayoutClient user={ user }>
        { children }
        </DashboardLayoutClient>
    </>
    )
}
