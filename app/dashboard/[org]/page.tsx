import { fetchEventsForOrg } from './actions';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { db } from '../../../db';
import { userProfiles, organizations } from '@/db/schema';
import { eq, and } from 'drizzle-orm/expressions';
import UserProfileHeaderDashboard from '@/components/Headers/UserProfileHeaderDashboard';


interface DashboardPageProps
{
    params: { org: string };
}

async function getDashboardData ( orgName: string )
{
    const supabase = createClient();

    // Fetch the authenticated user from Supabase auth
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if ( !user )
    {
        throw new Error( 'Not authenticated' );
    }

    // Fetch user's profile from your custom userProfiles table
    const userProfileData = await db
        .select( {
            id: userProfiles.id,
            organizationId: userProfiles.orgId,
            organizationName: organizations.name,
            department: userProfiles.department,
            avatar: userProfiles.profileImageUrl, // Fetch the actual avatar URL data
        } )
        .from( userProfiles )
        .innerJoin( organizations, eq( userProfiles.orgId, organizations.id ) )
        .where( and( eq( userProfiles.userId, user.id ), eq( organizations.name, orgName ) ) )
        .limit( 1 );

    // Check if userProfileData has elements
    const userProfile = userProfileData.length > 0 ? userProfileData[ 0 ] : null;

    // Extract user's name from Supabase auth.user table
    const userName = user?.user_metadata?.name || user.email; // Fallback to email if no name is set
    
    // Use the avatar URL from the auth.users table (provided by Google or Supabase)
    const userAvatarUrl = user?.user_metadata?.avatar_url || userProfile?.avatar || '/images/avatars/user_avatar_default.png';

    return userProfile ? { ...userProfile, userName, avatar: userAvatarUrl } : null; // Ensure avatar is returned
}

export default async function DashboardPage ( { params }: DashboardPageProps )
{
    try
    {
        const decodedOrgName = decodeURIComponent( params.org );
        const dashboardData = await getDashboardData( decodedOrgName );

        if ( !dashboardData )
        {
            notFound();
        }

        const events = await fetchEventsForOrg();
        const userName = dashboardData.userName || 'User'; // Fallback to 'User' if no name found

        return (
            <div className="">
                <header>
                    <UserProfileHeaderDashboard
                        userName={ userName }
                        organizationName={ dashboardData.organizationName }
                        userImageUrl={ dashboardData.avatar } // Use the correct property name
                        accountStatus="Verified Account"
                        orgId={ dashboardData.organizationId }
                    />
                </header>
               
                <div className="bg-white">
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Events</h2>
                        { events.length > 0 ? (
                            <div className="space-y-4">
                                { events.map( ( event ) => (
                                    <div key={ event.id } className="bg-gray-100 p-4 rounded-lg shadow-sm">
                                        <h3 className="text-lg font-bold">{ event.name }</h3>
                                        <p className="text-gray-600">
                                            <strong>Date:</strong>{ ' ' }
                                            { event.startDate
                                                ? new Date( event.startDate ).toLocaleDateString()
                                                : 'No start date' }{ ' ' }
                                            -{ ' ' }
                                            { event.endDate
                                                ? new Date( event.endDate ).toLocaleDateString()
                                                : 'No end date' }
                                        </p>
                                        <p className="text-gray-600">
                                            <strong>Venue:</strong> { event.venue || 'TBD' }
                                        </p>
                                        <p className="text-gray-600">
                                            <strong>Status:</strong> { event.status }
                                        </p>
                                    </div>
                                ) ) }
                            </div>
                        ) : (
                            <p className="text-gray-500">No events found for this organization.</p>
                        ) }
                    </div>
                </div>
            </div>
        );
    } catch ( error )
    {
        console.error( 'Error fetching dashboard data:', error );
        return (
            <div className="mx-auto">
                <h1 className="mb-6 text-3xl font-bold">Error</h1>
                <p className="text-xl text-red-600">
                    An error occurred while loading the dashboard. Please try again later.
                </p>
            </div>
        );
    }
}
