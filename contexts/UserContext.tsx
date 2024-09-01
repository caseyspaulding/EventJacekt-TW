// contexts/UserContext.tsx
'use client';
import type { ReactNode } from 'react';
import React, { createContext, useContext, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

type UserType = {
    id: string;
    email: string;
    orgName: string;
    organizationId: string;
    role: string;
    avatar: string;
};

type UserContextType = {
    user: UserType | null;
    setUser: ( user: UserType | null ) => void;
    loading: boolean;
    signInWithGoogle: ( token: string ) => Promise<void>;
    signOut: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>( undefined );

export function UserProvider ( {
    children,
    user: initialUser
}: {
    children: ReactNode;
    user: UserType | null;
} )
{
    const [ user, setUser ] = useState<UserType | null>( initialUser );
    const [ loading, setLoading ] = useState( false );
    
    const supabase = createClient();

    const signInWithGoogle = async ( token: string ) =>
    {
        setLoading( true );
        try
        {
            const { error } = await supabase.auth.signInWithIdToken( {
                provider: 'google',
                token,
            } );

            if ( error )
            {
                console.error( 'Error during Google sign-in:', error.message );
                setUser( null );
                return;
            }

            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            if ( sessionError || !sessionData.session )
            {
                console.error( 'Error fetching session after Google sign-in:', sessionError?.message );
                setUser( null );
                return;
            }

            // Fetch user profile from the server-side endpoint
            const response = await fetch( '/api/fetchUserProfile' );
            if ( response.ok )
            {
                const userProfile = await response.json();
                setUser( userProfile );
            } else
            {
                console.error( 'Error fetching user profile from server:', response.statusText );
                setUser( null );
            }
        } catch ( error )
        {
            console.error( 'Unexpected error during Google sign-in:', error );
            setUser( null );
        } finally
        {
            setLoading( false );
        }
    };

    const signOut = async () =>
    {
        setLoading( true );
        try
        {
            await supabase.auth.signOut();
            setUser( null );
        } catch ( error )
        {
            console.error( 'Error during sign-out:', error );
        } finally
        {
            setLoading( false );
        }
    };

    return (
        <UserContext.Provider value={ { user, setUser, loading, signInWithGoogle, signOut } }>
            { children }
        </UserContext.Provider>
    );
}

export function useUser ()
{
    const context = useContext( UserContext );
    if ( context === undefined )
    {
        throw new Error( 'useUser must be used within a UserProvider' );
    }
    return context;
}
