import { stripe } from '@/utils/stripe';
import { db } from '@/db';
import { organizations } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function handleStripeOAuthCallback ( req: Request )
{
  const { searchParams } = new URL( req.url );
  const code = searchParams.get( 'code' );
  const orgId = searchParams.get( 'state' ); // Retrieve orgId from the state parameter

  // Ensure that code and orgId are not null
  if ( !code || !orgId )
  {
    return new Response( JSON.stringify( { error: 'Missing code or organization ID' } ), { status: 400 } );
  }

  try
  {
    const response = await stripe.oauth.token( {
      grant_type: 'authorization_code',
      code: code, // TypeScript now knows code is a string
    } );

    const stripeUserId = response.stripe_user_id;

    // Update the organization with the new stripeConnectAccountId
    const result = await db
      .update( organizations )
      .set( { stripeConnectAccountId: stripeUserId } )
      .where( eq( organizations.id, orgId ) )
      .returning();

    if ( result.length === 0 )
    {
      return new Response( JSON.stringify( { error: 'Organization not found' } ), { status: 404 } );
    }

    return new Response( JSON.stringify( { success: true } ), { status: 200 } );
  } catch ( error )
  {
    console.error( 'Failed to connect Stripe account:', error );
    return new Response( JSON.stringify( { error: error } ), { status: 500 } );
  }
}
