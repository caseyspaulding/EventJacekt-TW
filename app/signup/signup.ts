'use server';

import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';

export const signUp = async ( formData: FormData ) =>
{
  const origin = headers().get( 'origin' ) || 'http://localhost:3000';
  const email = formData.get( 'email' ) as string;
  const password = formData.get( 'password' ) as string;
  const supabase = createClient();

  // Define the redirect URL for email confirmation
  const redirectTo = `${ origin }/confirm`;

  const googleToken = formData.get( 'googleToken' ) as string;

  if ( googleToken )
  {
    // Handle Google Sign-In
    try
    {
      const {  error } = await supabase.auth.signInWithIdToken( {
        provider: 'google',
        token: googleToken,
      } );

      if ( error )
      {
        console.error( 'Google sign-in error:', error.message, error.stack );
        return { success: false, message: 'Google sign-in failed', error: error.message };
      }

      // Re-fetch session to ensure it's created
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if ( sessionError || !sessionData?.session )
      {
        console.error( 'Session not created after Google sign-in', sessionError?.message );
        return { success: false, message: 'Session not created after Google sign-in' };
      }

      // Redirect to choose account type page
      return { success: true, redirectTo: '/choose-account-type' };
    } catch ( error )
    {
      console.error( 'Error during Google sign-in:', error );
      return { success: false, message: 'Could not complete Google sign-in' };
    }
  }

  if ( !email || !password )
  {
    return { success: false, message: 'Email and password are required' };
  }

  try
  {
    const { data: userResponse, error: signUpError } = await supabase.auth.signUp( {
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,  // Set the redirect URL for email confirmation
      },
    } );

    if ( signUpError )
    {
      console.error( 'Error during standard sign-up:', signUpError.message );
      return { success: false, message: 'Error during sign-up', error: signUpError.message };
    }

    // If email confirmation is required
    if ( userResponse.user && userResponse.user.identities && userResponse.user.identities.length === 0 )
    {
      return {
        success: true,
        message: 'Please check your email to confirm your account',
        redirectTo: '/signup-success',
      };
    } else
    {
      return {
        success: true,
        user: userResponse.user,
        redirectTo: '/choose-account-type',
      };
    }
  } catch ( error )
  {
    console.error( 'Error during signup:', error );
    return { success: false, message: 'Could not complete sign up' };
  }
};
