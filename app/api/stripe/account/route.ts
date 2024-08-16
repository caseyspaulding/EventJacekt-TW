import { stripe } from '@/utils/stripe';

export default async function handler ( req: { method: string; }, res: { json: ( arg0: { account?: string; error?: any; } ) => void; status: ( arg0: number ) => void; } )
{
  if ( req.method === 'POST' )
  {
    try
    {
      const account = await stripe.accounts.create( {} );

      res.json( { account: account.id } );
    } catch ( error )
    {
      console.error( 'An error occurred when calling the Stripe API to create an account:', error );
      res.status( 500 );
      res.json( { error: error} );
    }
  }
}