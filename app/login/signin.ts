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
    const { data: profile, error: profileError } = await supabase
        .from( 'user_profiles' )
        .select( 'organization_name' )
        .eq( 'user_id', user.id )
        .single();

    if ( profileError )
    {
        console.error( 'Error fetching user profile:', profileError );
        return redirect( '/login?message=Could not fetch user profile' );
    }

    // Redirect to the dynamic dashboard route
    return redirect( `/dashboard/${ encodeURIComponent( profile.organization_name ) }` );
};
