// app/api/signup/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';

export async function POST ( request: Request )
{
  const formData = await request.formData();

  // Await the headers to get the 'origin'
  const originHeader = await headers();
  const origin = originHeader.get( 'origin' ) || 'http://localhost:3000';

  const email = formData.get( 'email' ) as string;
  const password = formData.get( 'password' ) as string;
  const googleToken = formData.get( 'googleToken' ) as string;
  const supabase = await createClient();
  const redirectTo = `${ origin }/confirm`;

  if ( !email || !password )
  {
    return NextResponse.json( { success: false, message: 'Email and password are required' } );
  }

  try
  {
    if ( googleToken )
    {
      const { data, error } = await supabase.auth.signInWithIdToken( { provider: 'google', token: googleToken } );
      if ( error ) throw error;
      return NextResponse.json( { success: true, redirectTo: '/choose-account-type' } );
    } else
    {
      const { data: userResponse, error: userError } = await supabase.auth.signUp( {
        email,
        password,
        options: { emailRedirectTo: redirectTo },
      } );
      if ( userError ) throw userError;
      return NextResponse.json( {
        success: true,
        redirectTo: '/choose-account-type',
        user: userResponse.user,
      } );
    }
  } catch ( error )
  {
    console.error( 'Error during signup:', error );
    return NextResponse.json( { success: false, message: 'Signup error: ' + error } );
  }
}
