// app/payments/page.tsx (Server Component)
import { fetchStripeClientSecret } from '@/app/actions/stripeActions';
import PaymentsPageClient from './PaymentsPageClient';



const PaymentsPage = async () =>
{
  try
  {
    const clientSecret = await fetchStripeClientSecret();
    return <PaymentsPageClient clientSecret={ clientSecret } />;
  } catch ( error: any )
  {
    console.error( 'PaymentsPage: Error fetching client secret:', error.message );
    return <div>Error fetching payment information.</div>;
  }
};

export default PaymentsPage;
