import LogoSpinner from '@/components/Loaders/LogoSpinner';
import React from 'react';

export default function loading()
{
  return (
    <div className="flex h-screen items-center justify-center">
      <LogoSpinner />

     
    </div>
  );
}
