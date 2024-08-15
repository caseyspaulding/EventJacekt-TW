
import { createClient } from '@/utils/supabase/server';
import { db } from '@/db';
import { userProfiles, organizations } from '@/db/schema';
import { eq } from 'drizzle-orm/expressions';
import { stripe } from '@/utils/stripe';

export async function fetchUserProfile ()
{
  const supabase = createClient();
  const {
    data: { user: supabaseUser }
  } = await supabase.auth.getUser();

  if ( !supabaseUser )
  {
    return null;
  }

  const userProfileData = await db
    .select( {
      id: userProfiles.id,
      organizationId: userProfiles.orgId,
      organizationName: organizations.name,

      stripeConnectedAccountId: userProfiles.stripeConnectedAccountId,
      stripeCustomerId: userProfiles.stripeCustomerId,
      stripeSubscriptionId: userProfiles.stripeSubscriptionId,
      stripeConnectLinked: userProfiles.stripeConnectLinked


    } )
    .from( userProfiles )
    .innerJoin( organizations, eq( userProfiles.orgId, organizations.id ) )
    .where( eq( userProfiles.userId, supabaseUser.id ) )
    .limit( 1 );

  if ( userProfileData.length > 0 )
  {
    return {
      id: userProfileData[ 0 ].id,
      email: supabaseUser.email!,
      orgName: userProfileData[ 0 ].organizationName,
      organizationId: userProfileData[ 0 ].organizationId,
      stripeConnectedAccountId: userProfileData[ 0 ].stripeConnectedAccountId,
      stripeCustomerId: userProfileData[ 0 ].stripeCustomerId,
      stripeSubscriptionId: userProfileData[ 0 ].stripeSubscriptionId,
      stripeConnectLinked: userProfileData[ 0 ].stripeConnectLinked


    };
  }

  return null;
}