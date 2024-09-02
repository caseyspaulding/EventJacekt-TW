import { fetchEventsForOrg } from './actions';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { db } from '../../../db';
import { userProfiles, organizations } from '@/db/schema';
import { eq, and } from 'drizzle-orm/expressions';
import UserProfileHeaderDashboard from '@/components/Headers/UserProfileHeaderDashboard';
import { BanknotesIcon, FolderIcon, HomeIcon } from '@heroicons/react/24/outline';
import DashboardCardGrid from './components/DashboardGrid/DashboardGrid';
import { fetchTicketSalesForOrg } from '@/app/actions/dashboardActions';
import { Suspense } from 'react';
import { sql } from 'drizzle-orm';


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

    if ( !userProfile )
    {
        return null;
    }

    // Extract user's name from Supabase auth.user table
    const userName = user.user_metadata?.name || user.email; // Fallback to email if no name is set

    // Use the avatar URL from the auth.users table (provided by Google or Supabase)
    const userAvatarUrl = user.user_metadata?.avatar_url || userProfile.avatar || '/images/avatars/user_avatar_default.png';

    // Fetch total member count for the current organization
    const memberCountResult = await db
        .select( {
            count: sql`COUNT(*)`.as<number>(), // Ensure it's cast as a number
        } )
        .from( userProfiles )
        .where( eq( userProfiles.orgId, userProfile.organizationId ) );

    const totalMembers = memberCountResult[ 0 ]?.count || 0;

    return { ...userProfile, userName, avatar: userAvatarUrl, totalMembers }; // Ensure avatar and totalMembers are returned
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
        // Fetch ticket sales data for the organization
        const ticketSales = await fetchTicketSalesForOrg( dashboardData.organizationId );

        const totalSales = ticketSales
            ? ticketSales.reduce( ( acc, sale ) => acc + sale.amount, 0 ) // Calculate total sales
            : 0;
        const formattedTotalSales = `$${ ( totalSales / 100 ).toFixed( 2 ) }`; // Assuming amount is in cents

        
        const events = await fetchEventsForOrg();
        const userName = dashboardData.userName || 'User'; // Fallback to 'User' if no name found
        const totalMembers = dashboardData.totalMembers; // Use totalMembers from dashboardData
        const cards = [
            {
                name: 'Tickets Sold',
                icon: BanknotesIcon,
                amount: formattedTotalSales,
                href: '#',
            },
            {
                name: 'Total Events',
                icon: FolderIcon,
                amount: events.length,
                href: '#',
            },
            {
                name: 'Members',
                icon: HomeIcon,
                amount: totalMembers.toString(),    
                href: '#',
            },
        ];
        return (
            <div className="">
                <header>
                    {/* Client Component Wrapped in Suspense */ }
                    <Suspense fallback={ <div>Loading...</div> }>
                        <UserProfileHeaderDashboard
                            userName={ userName }
                            organizationName={ dashboardData.organizationName }
                            userImageUrl={ dashboardData.avatar }
                            accountStatus="Verified Account"
                            orgId={ dashboardData.organizationId }
                        />
                    </Suspense>
                </header>
              
                <div className="bg-white">
                    <DashboardCardGrid cards={ cards } />
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
