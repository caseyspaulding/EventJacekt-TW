import Error from "@/app/dashboard/error";
import { db } from "@/db";
import { userProfiles } from "@/db/schema";
import { stripe } from "@/utils/stripe";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

//export async function POST ( req: Request )
//{

//  const {account} = await req.text();
//  const signature = headers().get( 'Stripe-Signature' ) as string;

//  let event;

//  try
//  {
//    event = stripe.webhooks.constructEvent(
//      body,
//      signature,
//      process.env.STRIPE_CONNECT_WEBHOOK_SECRET as string);
//  }catch ( error: unknown )
//  {
//    console.error( 'WebHook Error:', error );
//    return new Response( 'WebHook Error', { status: 400 } );
//  }

//  switch ( event.type )
//  {
//    case 'account.application.authorized':
//      console.log( 'Account application authorized' );
//      break;
//    case 'account.application.deauthorized':
//      console.log( 'Account application deauthorized' );
//      break;
//    default:
//      console.log( 'Unhandled event type:', event.type );
//    case 'account.updated': {
//      const account = event.data.object
//      console.log( 'Account updated:',   );
//      // Update the account in the database





//    }
//  }
//}
export async function POST ()
{
  try
  {
    const account = await stripe.accounts.create( {} );
    return new Response( JSON.stringify( { account: account.id } ), { status: 200 } );
  } catch ( error )
  {
    console.error( 'An error occurred when calling the Stripe API to create an account:', error );
    return new Response( JSON.stringify( { error } ), { status: 500 } );
  }
}

