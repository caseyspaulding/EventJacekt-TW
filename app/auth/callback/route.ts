import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET ( request: Request )
{
  try
  {
    const requestUrl = new URL( request.url );
    const code = requestUrl.searchParams.get( 'code' );

    if ( !code )
    {
      return NextResponse.redirect( 'https://www.eventjacket.com/auth/sign-in?message=Missing%20authorization%20code' );
    }

    const supabase = createClient();

    // Exchange the authorization code for a session using PKCE
    const { data: session, error: exchangeError } = await supabase.auth.exchangeCodeForSession( code );

    if ( exchangeError )
    {
      console.error( 'Error exchanging code for session:', exchangeError );
      return NextResponse.redirect( 'https://www.eventjacket.com/auth/sign-in?message=Auth%20error' );
    }

    // Redirect to the onboarding page after successful exchange
    return NextResponse.redirect( 'https://www.eventjacket.com/auth/onboarding' );

  } catch ( error )
  {
    console.error( 'Unexpected error:', error );
    return NextResponse.redirect( 'https://www.eventjacket.com/auth/sign-in?message=Server%20error' );
  }
}
