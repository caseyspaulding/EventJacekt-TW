import { fetchEventsForOrg } from './actions';
import { notFound } from 'next/navigation';
import EventActions from './EventActions';
import { createClient } from "@/utils/supabase/server";
import { db } from "@/db";
import { userProfiles, organizations } from "@/db/schema";
import { eq, and } from "drizzle-orm/expressions";



interface DashboardPageProps
{
  params: { org: string }
}

async function getDashboardData ( orgName: string )
{
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if ( !user )
  {
    throw new Error( "Not authenticated" );
  }

  const userProfileData = await db
    .select( {
      id: userProfiles.id,
      organizationId: userProfiles.orgId,
      organizationName: organizations.name,
    } )
    .from( userProfiles )
    .innerJoin( organizations, eq( userProfiles.orgId, organizations.id ) )
    .where(
      and(eq( userProfiles.userId, user.id ),
      eq( organizations.name, orgName ))
    )
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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard for { decodedOrgName }</h1>
        <p className="text-xl mb-4">Welcome to { dashboardData.organizationName }</p>

        {/* Organization Info Section */ }
        <section className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Organization Info</h2>
          <p><strong>ID:</strong> { dashboardData.id }</p>
          <p><strong>Organization ID:</strong> { dashboardData.organizationId }</p>
        </section>

       

       
        {/* Events Section */ }
        <EventActions events={ events } />
      </div>
    );
  } catch ( error )
  {
    console.error( "Error fetching dashboard data:", error );
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Error</h1>
        <p className="text-xl text-red-600">
          An error occurred while loading the dashboard. Please try again later.
        </p>
      </div>
    );
  }
}
