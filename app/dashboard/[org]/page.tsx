import { fetchEventsForOrg } from './actions';
import { notFound } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';
import { db } from '../../../db';
import { userProfiles, organizations } from '@/db/schema';
import { eq, and } from 'drizzle-orm/expressions';
import ClientDashboard from './ClientDashboard';

interface DashboardPageProps {
    params: { org: string };
}

async function getDashboardData(orgName: string) {
    const supabase = createClient();
    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Not authenticated');
    }

    const userProfileData = await db
        .select({
            id: userProfiles.id,
            organizationId: userProfiles.orgId,
            organizationName: organizations.name
        })
        .from(userProfiles)
        .innerJoin(organizations, eq(userProfiles.orgId, organizations.id))
        .where(and(eq(userProfiles.userId, user.id), eq(organizations.name, orgName)))
        .limit(1);

    return userProfileData[0] || null;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
    try {
        const decodedOrgName = decodeURIComponent(params.org);
        const dashboardData = await getDashboardData(decodedOrgName);

        if (!dashboardData) {
            notFound();
        }

        const events = await fetchEventsForOrg();

        return (
            <ClientDashboard
                orgName={decodedOrgName}
                dashboardData={dashboardData}
                events={events}
            />
        );
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="mb-6 text-3xl font-bold">Error</h1>
                <p className="text-xl text-red-600">
                    An error occurred while loading the dashboard. Please try again later.
                </p>
            </div>
        );
    }
}
