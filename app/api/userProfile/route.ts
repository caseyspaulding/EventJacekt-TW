import { fetchUserProfile } from '@/app/actions/fetchUserProfile';
import { NextResponse, type NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET ( request: NextRequest )
{
  try
  {
    
    const userProfile = await fetchUserProfile( request );

    if ( !userProfile )
    {
      return NextResponse.json( { error: 'User not authenticated' }, { status: 401 } );
    }

    return NextResponse.json( userProfile, { status: 200 } );
  } catch ( error )
  {
    console.error( 'Error fetching user profile:', error );
    return NextResponse.json( { error: 'Failed to fetch user profile' }, { status: 500 } );
  }
}