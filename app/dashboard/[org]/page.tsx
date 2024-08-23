import { fetchEventsForOrg } from './actions';
import { notFound } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';
import { db } from '../../../db';
import { userProfiles, organizations } from '@/db/schema';
import { eq, and } from 'drizzle-orm/expressions';

interface DashboardPageProps
{
    params: { org: string };
}

async function getDashboardData ( orgName: string )
{
    const supabase = createClient();
    const {
        data: { user }
    } = await supabase.auth.getUser();

    if ( !user )
    {
        throw new Error( 'Not authenticated' );
    }

    const userProfileData = await db
        .select( {
            id: userProfiles.id,
            organizationId: userProfiles.orgId,
            organizationName: organizations.name
        } )
        .from( userProfiles )
        .innerJoin( organizations, eq( userProfiles.orgId, organizations.id ) )
        .where( and( eq( userProfiles.userId, user.id ), eq( organizations.name, orgName ) ) )
        .limit( 1 );

    return userProfileData[ 0 ] || null;
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

        return (
            <div className="">
                <h1 className="text-3xl font-bold mb-4">Hi, Welcome back 👋 </h1>
                <div className="bg-white  ">
                    {/*<p className="text-gray-700 mb-4">
                        <strong>Organization Name:</strong> { decodedOrgName }
                    </p>
                    <p className="text-gray-700 mb-4">
                        <strong>Organization ID:</strong> { dashboardData.organizationId }
                    </p>*/}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Events</h2>
                        { events.length > 0 ? (
                            <div className="space-y-4">
                                { events.map( ( event ) => (
                                    <div
                                        key={ event.id }
                                        className="bg-gray-100 p-4 rounded-lg shadow-sm"
                                    >
                                        <h3 className="text-lg font-bold">{ event.name }</h3>
                                        <p className="text-gray-600">
                                            <strong>Date:</strong>{ " " }
                                            { event.startDate ? new Date( event.startDate ).toLocaleDateString() : "No start date" } -{ " " }
                                            { event.endDate ? new Date( event.endDate ).toLocaleDateString() : "No end date" }
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
            <div className=" mx-auto">
                <h1 className="mb-6 text-3xl font-bold">Error</h1>
                <p className="text-xl text-red-600">
                    An error occurred while loading the dashboard. Please try again later.
                </p>
            </div>
        );
    }
}
