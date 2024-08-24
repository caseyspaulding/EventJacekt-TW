// app/auth/onboarding/page.tsx
import React from 'react';
import Onboarding from './OnboardingClient'; 
import { Suspense } from 'react';

export default function OnboardingPage ()
{
  <Suspense fallback={ <div>Loading...</div> }>
   <Onboarding />;
  </Suspense>
}
