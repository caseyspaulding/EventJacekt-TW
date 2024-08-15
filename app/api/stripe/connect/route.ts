
import { stripe } from "@/utils/stripe";
import { headers } from "next/headers";
import { updateUserProfile } from '@/db/dataAccess/userProfiles';


export async function POST ( req: Request )
{
  const body = await req.text();

  const signature = headers().get( "Stripe-Signature" );

  let event;

  try
  {
    event = stripe.webhooks.constructEvent(
      body,
      signature as string,
      process.env.STRIPE_CONNECT_WEBHOOK_SECRET as string
    );
  } catch ( error: unknown )
  {
    console.error( "Webhook signature verification failed:", error );
    return new Response( "Webhook error", { status: 400 } );
  }

  switch ( event.type )
  {
    case "account.updated": {
      const account = event.data.object 

      // Update the user's stripeConnectedLinked status in the database
      try
      {
        const stripeConnectLinked =
          account.capabilities?.transfers === "active";

        await updateUserProfile( account.id, {
          stripeConnectLinked,
        } );

        console.log( `Updated user with account ID ${ account.id }` );
      } catch ( error )
      {
        console.error( `Failed to update user with account ID ${ account.id }:`, error );
        return new Response( "Failed to update user", { status: 500 } );
      }

      break;
    }
    default: {
      console.log( "Unhandled event type:", event.type );
    }
  }

  return new Response( null, { status: 200 } );
}
