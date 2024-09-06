import { fetchEventsForOrg } from './actions';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { db } from '../../../db';
import { userProfiles, organizations } from '@/db/schema';
import { eq, and } from 'drizzle-orm/expressions';
import UserProfileHeaderDashboard from '@/components/Headers/UserProfileHeaderDashboard';
import { BanknotesIcon,  ChevronRightIcon, FolderIcon, HomeIcon } from '@heroicons/react/24/outline';
import DashboardCardGrid from './components/DashboardGrid/DashboardGrid';
import { fetchTicketSalesForOrg } from '@/app/actions/dashboardActions';
import { Suspense } from 'react';
import { sql } from 'drizzle-orm';
import Link from 'next/link';

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
            avatar: userProfiles.profileImageUrl,
        } )
        .from( userProfiles )
        .innerJoin( organizations, eq( userProfiles.orgId, organizations.id ) )
        .where( and( eq( userProfiles.userId, user.id ), eq( organizations.name, orgName ) ) )
        .limit( 1 );

    const userProfile = userProfileData.length > 0 ? userProfileData[ 0 ] : null;

    if ( !userProfile )
    {
        return null;
    }

    const userName = user.user_metadata?.name || user.email; // Fallback to email if no name is set
    const userAvatarUrl = user.user_metadata?.avatar_url || userProfile.avatar || '/images/avatars/user_avatar_default.png';

    // Fetch total member count for the current organization
    const memberCountResult = await db
        .select( {
            count: sql`COUNT(*)`.as<number>(),
        } )
        .from( userProfiles )
        .where( eq( userProfiles.orgId, userProfile.organizationId ) );

    const totalMembers = memberCountResult[ 0 ]?.count || 0;

    return { ...userProfile, userName, avatar: userAvatarUrl, totalMembers };
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

        const ticketSales = await fetchTicketSalesForOrg( dashboardData.organizationId );
        const totalSales = ticketSales ? ticketSales.reduce( ( acc, sale ) => acc + sale.amount, 0 ) : 0;
        const formattedTotalSales = `$${ ( totalSales / 100 ).toFixed( 2 ) }`; // Assuming amount is in cents

        const events = await fetchEventsForOrg();
        const userName = dashboardData.userName || 'User';
        const totalMembers = dashboardData.totalMembers;

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
                href: '`/dashboard/${ orgName }',
            },
            {
                name: 'Members',
                icon: HomeIcon,
                amount: totalMembers.toString(),
                href: '#',
            },
        ];
       
        const breadcrumbs = [
            { name: 'Dashboard', href: '/' },
            { name: '', href: '' },
          
        ];
       

        return (
            <div className="">
                <div>
                    <div>
                        {/* Back Navigation for Small Screens */ }
                        <nav aria-label="Back" className="sm:hidden">
                            
                        </nav>

                        {/* Breadcrumbs for Larger Screens */ }
                        <nav aria-label="Breadcrumb" className="hidden sm:flex">
                            <ol role="list" className="flex items-center space-x-4">
                                { breadcrumbs.map( ( breadcrumb, index ) => (
                                    <li key={ breadcrumb.name }>
                                        <div className="flex items-center">
                                            { index > 0 && (
                                                <ChevronRightIcon
                                                    aria-hidden="true"
                                                    className="h-5 w-5 mr-4 flex-shrink-0 text-gray-400"
                                                />
                                            ) }
                                            <Link href='/' >
                                                <div
                                                    className={ ` text-sm  font-medium text-gray-500 hover:text-gray-700 ${ breadcrumb ? 'text-gray-700' : ''
                                                        }` }
                                                    aria-current={ breadcrumb? 'page' : undefined }
                                                >
                                                    { breadcrumb.name }
                                                </div>
                                            </Link>
                                        </div>
                                    </li>
                                ) ) }
                            </ol>
                        </nav>
                    </div>

                    {/* Page Title and Actions */ }
                    <div className="mt-2 md:flex md:items-center md:justify-between mb-2">
                        <div className="min-w-0 flex-1">
                            <h2 className="text-5xl pt-2 mt-1 font-bold leading-7 text-gray-900 sm:mt-1 sm:truncate sm:text-6xl sm:tracking-tight">
                               Dashboard
                            </h2>
                        </div>
                        <div className="mt-4 flex flex-shrink-0 md:ml-4 md:mt-0">

                        </div>
                    </div>
                </div>
                <header>
                    <Suspense fallback={ <div>Loading...</div> }>
                        <UserProfileHeaderDashboard
                            userName={ userName }
                            organizationName={ dashboardData.organizationName }
                            userImageUrl={ dashboardData.avatar }
                            accountStatus="Verified Account"

                        />
                    </Suspense>
                </header>

                <div className="bg-white max-w-6xl">
                    <DashboardCardGrid cards={ cards } />
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Events</h2>
                        { events.length > 0 ? (
                            <div className="space-y-4">
                                { events.map( ( event ) => (
                                    <div key={ event.id } className="bg-gray-100 p-4 rounded-lg shadow-sm">
                                        <h3 className="text-lg font-bold">{ event.name }</h3>
                                        <p className="text-gray-600">
                                            <strong>Date:</strong> { event.startDate ? new Date( event.startDate ).toLocaleDateString() : 'No start date' } -{ ' ' }
                                            { event.endDate ? new Date( event.endDate ).toLocaleDateString() : 'No end date' }
                                        </p>
                                        <p className="text-gray-600">
                                            <strong>Venue:</strong> { event.venue || 'TBD' }
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
