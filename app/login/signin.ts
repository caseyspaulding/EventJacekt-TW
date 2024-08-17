// app/actions/authActions.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export const signIn = async ( formData: FormData ) =>
{
    const email = formData.get( 'email' ) as string;
    const password = formData.get( 'password' ) as string;
    const supabase = createClient();

    const { data: session, error } = await supabase.auth.signInWithPassword( {
        email,
        password
    } );

    if ( error )
    {
        return redirect( '/login?message=Could not authenticate user' );
    }

    const { user } = session;

    // Check if the user is authenticated
    if ( !user )
    {
        console.error( 'No user found after authentication.' );
        return redirect( '/login?message=Could not find authenticated user' );
    }

    const { data: profile, error: profileError } = await supabase
        .from( 'user_profiles' )
        .select( 'organization_name' )
        .eq( 'user_id', user.id )
        .maybeSingle(); // This will return null if no rows are found

    if ( profileError )
    {
        console.error( 'Error fetching user profile:', profileError );
        return redirect( '/login?message=Could not fetch user profile' );
    }

    if ( !profile )
    {
        console.error( 'No profile found for the user.' );
        return redirect( '/login?message=No profile found for the user' );
    }

    // Redirect to the dynamic dashboard route
    return redirect( `/dashboard/${ encodeURIComponent( profile.organization_name ) }` );
};
