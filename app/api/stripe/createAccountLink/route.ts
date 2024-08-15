import { stripe } from '@/utils/stripe';
import { db } from '@/db';

export async function POST ( req: Request )
{
  try
  {
    const { account } = await req.json();
    console.log( account );

    const accountLink = await stripe.accountLinks.create( {
      account: account,
      refresh_url: `${ req.headers.get( 'origin' ) }/refresh/${ account }`,
      return_url: `${ req.headers.get( 'origin' ) }/return/${ account }`,
      type: 'account_onboarding',
    } );



    console.log( 'Stripe account link created successfully:', accountLink.url );
    return new Response( JSON.stringify( { url: accountLink.url } ), { status: 200 } );

  } catch ( error )
  {
    console.error( 'An error occurred when calling the Stripe API to create an account link:', error );
    return new Response( JSON.stringify( { error: error } ), { status: 500 } );
  }
}
