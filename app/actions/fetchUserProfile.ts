import { createClient } from '@/utils/supabase/server';
import { db } from '@/db';
import { userProfiles, organizations } from '@/db/schema';
import { eq } from 'drizzle-orm/expressions';

export async function fetchUserProfile ()
{
    const supabase = createClient();

    // Get user data from Supabase auth
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();

    if ( !supabaseUser )
    {
        return null;
    }

    // Fetch user profile and organization data from your custom tables
    const userProfileData = await db
        .select( {
            id: userProfiles.id,
            organizationId: userProfiles.orgId,
            organizationName: organizations.name,
        } )
        .from( userProfiles )
        .innerJoin( organizations, eq( userProfiles.orgId, organizations.id ) )
        .where( eq( userProfiles.userId, supabaseUser.id ) )
        .limit( 1 );

    if ( userProfileData.length > 0 )
    {
        const userProfile = userProfileData[ 0 ];

        // Combine data from Supabase auth and your custom tables
        return {
            id: userProfile.id,
            email: supabaseUser.email!,
            orgName: userProfile.organizationName,
            organizationId: userProfile.organizationId,
            role: supabaseUser.user_metadata?.role || 'User',  // Use a default role if not present
            avatar: supabaseUser.user_metadata?.avatar_url || '/images/avatars/user_avatar_default.png',  // Use a default avatar if not present
        };
    }

    return null;
}
