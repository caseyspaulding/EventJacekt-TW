'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import UserProvider from '@/contexts/UserContext';
import DashboardLayoutTW from './components/DashboardLayoutTW/DashboardLayoutTW';
import type { UserType } from '@/types/UserType';

interface DashboardLayoutClientProps
{
  children: React.ReactNode;
  user: UserType | null;
  stripePublishableKey: string; // Accept Stripe publishable key as a prop
}

export default function DashboardLayoutClient ( { children, user, stripePublishableKey }: DashboardLayoutClientProps )
{
  const [ stripe, setStripe ] = useState<Stripe | null>( null );

  // Initialize Stripe
  useEffect( () =>
  {
    const initializeStripe = async () =>
    {
      if ( stripePublishableKey )
      {
        const stripeInstance = await loadStripe( stripePublishableKey );
        setStripe( stripeInstance );
      }
    };

    initializeStripe();
  }, [ stripePublishableKey ] );

  // Check if user is properly initialized
  if ( user === undefined )
  {
    console.error( 'User is undefined, ensure UserProvider is initialized correctly' );
    return <div>Error: User context is not properly initialized.</div>;
  }

  return (
    <UserProvider initialUser={ user }>
      {/* Optionally, you can provide the stripe instance to child components via context */ }
      <DashboardLayoutTW>{ children }</DashboardLayoutTW>
    </UserProvider>
  );
}
