import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

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

    // Attempt to exchange the authorization code for a session
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: session, error: exchangeError } = await supabase.auth.exchangeCodeForSession( code );
    if ( exchangeError )
    {
      console.error( 'Error exchanging code for session:', exchangeError );
      return NextResponse.redirect( 'https://www.eventjacket.com/auth/sign-in?message=Auth%20error' );
    }

    // Directly redirect to the onboarding page after a successful sign-in
    return NextResponse.redirect( 'https://www.eventjacket.com/auth/onboarding' );

  } catch ( error )
  {
    console.error( 'Unexpected error:', error );
    return NextResponse.redirect( 'https://www.eventjacket.com/auth/sign-in?message=Server%20error' );
  }
}
