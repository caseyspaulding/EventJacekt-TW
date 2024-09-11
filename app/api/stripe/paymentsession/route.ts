 // Adjust the import based on your structure
import { fetchPaymentsClientSecret } from '@/app/dashboard/[org]/banking/payments/actions';
import { NextResponse } from 'next/server';

export async function POST ( request: Request )
{
  try
  {
    const { orgId } = await request.json(); // Extract orgId from the request body

    if ( !orgId )
    {
      return NextResponse.json( { error: 'Organization ID is required' }, { status: 400 } );
    }

    const clientSecret = await fetchPaymentsClientSecret( orgId );

    return NextResponse.json( { client_secret: clientSecret } );
  } catch ( error )
  {
    console.error( 'Error fetching payments session:', error );
    return NextResponse.json( { error: 'Failed to fetch payment session' }, { status: 500 } );
  }
}
