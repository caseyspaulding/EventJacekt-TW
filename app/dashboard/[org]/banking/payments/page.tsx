'use client';

import { useEffect, useState, useCallback } from 'react';
import { loadConnectAndInitialize } from '@stripe/connect-js';
import { createPaymentSession } from '@/app/actions/createPaymentSession'; // Server action
import { ConnectPaymentDetails, ConnectComponentsProvider } from '@stripe/react-connect-js';

const PaymentDetailsModal = ({ paymentId, stripeConnectInstance, onClose }: any) => {
  return (
    <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
      <ConnectPaymentDetails payment={paymentId} onClose={onClose} />
    </ConnectComponentsProvider>
  );
};

export default function PaymentsPage({ params }: { params: { org: string } }) {
  const [stripeConnectInstance, setStripeConnectInstance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null); // For payment details
  const [payments, setPayments] = useState<any[]>([]); // Simulate actual payments

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const secret = await createPaymentSession(params.org); // Fetch session from server action
        setClientSecret(secret);
      } catch (error) {
        console.error('Error fetching client secret:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientSecret();
  }, [params.org]);

  // Initialize Stripe Connect once client secret is ready
  useEffect(() => {
    if (clientSecret && !stripeConnectInstance) {
      const initializeStripe = async () => {
        const instance = await loadConnectAndInitialize({
          publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
          fetchClientSecret: () => Promise.resolve(clientSecret),
        });
        setStripeConnectInstance(instance);
      };

      initializeStripe();
    }
  }, [clientSecret, stripeConnectInstance]);

  // Append the payments component once Stripe is ready
  useEffect(() => {
    if (stripeConnectInstance && !document.querySelector('.StripeElement')) {
      const container = document.getElementById('payments-container');

      if (container) {
        const paymentsComponent = stripeConnectInstance.create('payments');
        container.appendChild(paymentsComponent);
      }
    }
  }, [stripeConnectInstance]);

  // Function to open payment details overlay
  const openPaymentDetails = (paymentId: string) => {
    setSelectedPaymentId(paymentId);
    setShowPaymentDetails(true);
  };

  // Function to close payment details overlay
  const closePaymentDetails = useCallback(() => {
    setShowPaymentDetails(false);
    setSelectedPaymentId(null);
  }, []);

  if (loading) {
    return <div>Loading payments management...</div>;
  }

  if (!stripeConnectInstance) {
    return <div>Failed to load payments management. Please try again later.</div>;
  }

  return (
    <div className='bg-white p-6 rounded-2xl shadow-md'>
      <h1 className="text-3xl font-semibold mb-4">Payments</h1>
      <div id="payments-container"></div>

      {/* Dynamic payment buttons */}
      {payments.map((payment) => (
        <button key={payment.id} onClick={() => openPaymentDetails(payment.id)}>
          Show Payment Details for {payment.amount}
        </button>
      ))}

      <div id="error" hidden>
        Something went wrong!
      </div>

      {/* Payment Details Overlay */}
      {showPaymentDetails && selectedPaymentId && stripeConnectInstance && (
        <PaymentDetailsModal
          paymentId={selectedPaymentId}
          stripeConnectInstance={stripeConnectInstance}
          onClose={closePaymentDetails}
        />
      ) }
      <div className="pt-6">
        <h2 className="text-2xl font-semibold mb-4">Understanding Payments</h2>
        <p className="text-gray-700 mb-4">
          Payments refer to the transactions that occur when attendees purchase tickets for your events, make donations, or pay for any services you offer through EventJacket. Stripe Connect handles the secure processing of these payments, ensuring that the funds are collected and available for payout to your account.
        </p>

        <h3 className="text-lg font-semibold mb-2">How Payments Work</h3>
        <ul className="list-disc list-inside mb-4">
          <li>When an attendee purchases a ticket or makes a donation, a payment is created and processed securely by Stripe.</li>
          <li>You can view all your recent payments here, including the date, status, and amount of each payment.</li>
          <li>Each payment is tied to a specific event or donation, allowing you to track your earnings per event.</li>
        </ul>

        <h3 className="text-lg font-semibold mb-2">Payment Statuses</h3>
        <p className="text-gray-700 mb-4">
          Each payment will have one of the following statuses:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li><strong>Paid:</strong> The payment has been successfully processed, and the funds are available for payout.</li>
          <li><strong>Pending:</strong> The payment is currently being processed and will be completed shortly.</li>
          <li><strong>Failed:</strong> The payment was not successfully processed. This could be due to issues with the payment method or insufficient funds.</li>
          <li><strong>Refunded:</strong> The payment has been refunded to the attendee or donor.</li>
        </ul>

        <h3 className="text-lg font-semibold mb-2">Viewing Payment Details</h3>
        <ul className="list-disc list-inside mb-4">
          <li>Click on a specific payment to view more details, including the breakdown of fees, refund options, and customer information.</li>
          <li>Manage refunds and disputes directly from this page by selecting the payment and following the provided steps.</li>
        </ul>

        <h3 className="text-lg font-semibold mb-2">Exporting Payment Data</h3>
        <ul className="list-disc list-inside mb-4">
          <li>You can export your payment history by clicking the <strong>Export</strong> button. This is useful for tracking earnings and preparing financial reports.</li>
          <li>Filter your payments by date or status using the <strong>Filters</strong> button to view the specific transactions you need.</li>
        </ul>

        <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
        <p className="text-gray-700">
          If you need assistance with managing your payments or have questions about specific transactions, feel free to reach out to our support team for help.
        </p>
      </div>
    </div>
  );
}
