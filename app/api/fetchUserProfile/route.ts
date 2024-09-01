import { fetchUserProfile } from '@/app/actions/fetchUserProfile';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Define a TypeScript type for the expected response structure
interface ErrorResponse
{
  error: string;
}

interface SuccessResponse
{
  id: string;
  email: string;
  orgName: string;
  organizationId: string;
  role: string;
  avatar: string;
  // Add other fields as per your UserType
}

export async function GET (): Promise<NextResponse<ErrorResponse | SuccessResponse>>
{
  try
  {
    const userProfile = await fetchUserProfile();

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
