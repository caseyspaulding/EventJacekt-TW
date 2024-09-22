import { fetchEventsForOrg } from './actions';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { db } from '../../../db';
import { userProfiles, organizations } from '@/db/schema';
import { eq, and } from 'drizzle-orm/expressions';
import UserProfileHeaderDashboard from '@/components/Headers/UserProfileHeaderDashboard';
import { BanknotesIcon, ChevronRightIcon, FolderIcon, HomeIcon } from '@heroicons/react/24/outline';
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
                href: `/dashboard/${ decodedOrgName }/tickets-sole`,
            },
            {
                name: 'Total Events',
                icon: FolderIcon,
                amount: events.length,
                href: `/dashboard/${ decodedOrgName }/events`, // Dynamic link based on orgName
            },
            {
                name: 'Members',
                icon: HomeIcon,
                amount: totalMembers.toString(),
                href: `/dashboard/${ decodedOrgName }/members`,
            },
        ];

        const breadcrumbs = [
            { name: 'Dashboard', href: '/' },
            { name: '', href: '' },

        ];


        return (
        
                <div className=" ">
                <div className='sticky top-4 rounded-tl-2xl z-10 py-4 bg-white '></div>
                <div className='bg-white'>
                    <div>
                        {/* Back Navigation for Small Screens */ }
                        <nav aria-label="Back" className="sm:hidden">

                        </nav>

                        {/* Breadcrumbs for Larger Screens */ }
                        <nav aria-label="Breadcrumb" className="hidden sm:flex bg-white">
                            <ol role="list" className="flex items-center space-x-4 bg-white">
                                { breadcrumbs.map( ( breadcrumb, index ) => (
                                    <li key={ breadcrumb.name }>
                                        <div className="flex items-center bg-white">
                                            { index > 0 && (
                                                <ChevronRightIcon
                                                    aria-hidden="true"
                                                    className="h-5 w-5 mr-4 flex-shrink-0 text-gray-400"
                                                />
                                            ) }
                                            <Link href='/' >
                                                <div
                                                    className={ ` text-sm bg-white font-medium text-gray-500 hover:text-gray-700 ${ breadcrumb ? 'text-gray-700' : ''
                                                        }` }
                                                    aria-current={ breadcrumb ? 'page' : undefined }
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
                <div className="my-8 bg-white">
                    <h1 className="text-2xl font-bold mb-4">Your Events</h1>
                    { events.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Event Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Start Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            End Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    { events.map( ( event ) => (
                                        <tr key={ event.id }>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Link href={ `/events/${ event.slug }` }>
                                                    <div className="text-gray-700 hover:underline">{ event.name }</div>
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                { event.description || 'No description available' }
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                { event.startDate ? new Date( event.startDate ).toLocaleDateString() : 'N/A' }
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                { event.endDate ? new Date( event.endDate ).toLocaleDateString() : 'N/A' }
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">{ event.status }</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Link href={ `/events/${ event.slug }` }>
                                                    <div className="text-blue-600 hover:text-blue-900 cursor-pointer mt-2">
                                                        View Public Page
                                                        <span className="sr-only">, { event.name }</span>
                                                    </div>
                                                </Link>
                                            </td>
                                        </tr>
                                    ) ) }
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>No events found for your organization.</p>
                    ) }
                </div>
                <div className="bg-white max-w-6xl">
                    <DashboardCardGrid cards={ cards } />
                    <div>


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
