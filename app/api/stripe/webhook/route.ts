import { db } from '@/db';
import { orgEventTickets } from '@/db/schema';
import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getOrgCreateCustomer, fetchTicketAndEventDetails, sendTicketEmailWithDetails } from '@/app/actions/updateOrg'; // import your helpers
import type { OrgTicketType } from '@/types/dbTypes';
import { eq } from 'drizzle-orm/expressions';

const stripe = new Stripe( process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
} );

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// New configuration method
export const dynamic = 'force-dynamic';

export async function POST ( request: NextRequest )
{
  const sig = request.headers.get( 'stripe-signature' );

  if ( !sig )
  {
    console.error( 'No Stripe signature found' );
    return NextResponse.json( { error: 'No Stripe signature found' }, { status: 400 } );
  }

  try
  {
    const text = await request.text();
    const event = stripe.webhooks.constructEvent( text, sig, endpointSecret );

    switch ( event.type )
    {
      case 'checkout.session.completed': {
        // eslint-disable-next-line no-case-declarations
        const session = event.data.object as Stripe.Checkout.Session;

        // Retrieve ticket data
        const [ ticket ] = await db
          .select()
          .from( orgEventTickets )
          .where( eq( orgEventTickets.stripeSessionId, session.id ) )
          .execute();

        if ( !ticket )
        {
          throw new Error( 'Ticket not found' );
        }

        // Fetch ticket type and event details
        const ticketTypeData = await fetchTicketAndEventDetails( ticket.ticketTypeId );

        // Fetch or create customer
        const buyer = {
          firstName: session.customer_details?.name,
          email: session.customer_email
        }; // Get buyer info from Stripe session
        const customer = await getOrgCreateCustomer( buyer, ticket.ticketTypeId );

        // Send ticket email
        await sendTicketEmailWithDetails(
          customer,
          ticket as unknown as OrgTicketType,
          ticketTypeData
        );

        console.log( `Ticket email sent to ${ customer.email }` );
        break;
      }
      default:
        console.log( `Unhandled event type ${ event.type }` );
    }

    return NextResponse.json( { received: true } );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch ( err: any )
  {
    console.error( '⚠️ Webhook Error:', err.message );
    return NextResponse.json( { error: `Webhook Error: ${ err.message }` }, { status: 400 } );
  }
}