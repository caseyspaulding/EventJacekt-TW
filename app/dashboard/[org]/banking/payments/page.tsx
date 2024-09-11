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
      )}
    </div>
  );
}
