'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client'; // Ensure this points to your Supabase client setup
import type { ReactNode } from 'react';

// Define UserType with the expected user fields
export interface UserType
{
    id: string;
    email: string;
    orgName: string;
    organizationId: string;
    role: string;
    avatar: string;
    contactNumber?: string;
    bio?: string;
    socialLinks?: Record<string, string>;
    isActive: boolean;
    lastLogin?: Date;
    permissions?: Record<string, boolean>;
    preferences?: Record<string, unknown>;
    department?: string;
    createdAt: Date;
    updatedAt: Date;
}

type UserContextType = {
    user: UserType | null;
    setUser: ( user: UserType | null ) => void;
    loading: boolean;
    signInWithGoogle: ( token: string ) => Promise<void>;
    signOut: () => Promise<void>;
};

// Create the UserContext with default undefined value
const UserContext = createContext<UserContextType | undefined>( undefined );

export function UserProvider ( { children, user: initialUser }: { children: ReactNode; user: UserType | null; } )
{
    const [ user, setUser ] = useState<UserType | null>( initialUser );
    const [ loading, setLoading ] = useState( false );

    // Initialize Supabase client
    const supabase = createClient();

    // Function to handle Google Sign-In
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

    // Function to handle Sign-Out
    const signOut = async () =>
    {
        setLoading( true );
        try
        {
            const { error } = await supabase.auth.signOut();
            if ( error ) throw error;
            setUser( null );
        } catch ( error )
        {
            console.error( 'Error during sign-out:', error );
        } finally
        {
            setLoading( false );
        }
    };

    // Automatically fetch user profile on mount if initial user is provided
    useEffect( () =>
    {
        const fetchInitialUserProfile = async () =>
        {
            if ( !user && initialUser )
            {
                setUser( initialUser );
            } else if ( !user && !initialUser )
            {
                // If no user is provided, fetch user profile from Supabase
                const { data: { user: supabaseUser } } = await supabase.auth.getUser();
                if ( supabaseUser )
                {
                    const response = await fetch( '/api/fetchUserProfile' );
                    if ( response.ok )
                    {
                        const userProfile = await response.json();
                        setUser( userProfile );
                    } else
                    {
                        setUser( null );
                    }
                }
            }
        };

        fetchInitialUserProfile();
    }, [ user, initialUser, supabase ] );

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
