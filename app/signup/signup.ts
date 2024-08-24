'use server';

import { db } from '@/db';
import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';

export const signUp = async ( formData: FormData ) =>
{
  const origin = headers().get( 'origin' ) || 'http://localhost:3000';
  const email = formData.get( 'email' ) as string;
  const password = formData.get( 'password' ) as string;
  const supabase = createClient();

  // Input validation
  if ( !email || !password )
  {
    return { success: false, message: 'Email and password are required' };
  }

  try
  {
    // Step 1: Create user with Supabase
    const { data: userResponse, error: userError } = await supabase.auth.signUp( {
      email,
      password,
      options: {
        emailRedirectTo: `${ origin }/auth/callback`,
      },
    } );

    if ( userError || !userResponse?.user )
    {
      console.error( 'User creation error:', userError );
      return { success: false, message: 'Could not create user' };
    }

    // Redirect to the next step
    return { success: true, redirectTo: '/choose-account-type' };
  } catch ( error )
  {
    console.error( 'Error during signup:', error );
    return { success: false, message: 'Could not complete sign up' };
  }
};

// Handle Google Sign-In
export const googleSignIn = async ( token: string ) =>
{
  const supabase = createClient();

  try
  {
    const { data, error } = await supabase.auth.signInWithIdToken( {
      provider: 'google',
      token,
    } );

    if ( error )
    {
      console.error( 'Google sign-in error:', error );
      return { success: false, message: 'Google sign-in failed' };
    }

    // Redirect to choose account type
    return { success: true, redirectTo: '/choose-account-type' };
  } catch ( error )
  {
    console.error( 'Error during Google sign-in:', error );
    return { success: false, message: 'Could not complete Google sign-in' };
  }
};
