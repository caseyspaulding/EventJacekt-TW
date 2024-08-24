'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { registerOrganization } from './registerOrganization'; // Update with correct path
import { Button, Input } from '@nextui-org/react';

const RegisterOrganizationPage = () =>
{
  const router = useRouter();

  const handleSubmit = async ( event: React.FormEvent<HTMLFormElement> ) =>
  {
    event.preventDefault();
    const formData = new FormData( event.currentTarget );

    const result = await registerOrganization( formData );

    if ( result.success )
    {
      // Redirect to the organization's dashboard using dynamic routing
      router.push( `/dashboard/${ result.orgName }` );
    } else
    {
      console.error( result.message );
    }
  };

  return (
    <form onSubmit={ handleSubmit }>
      <Input type="text" name="orgName" required placeholder="Organization Name" />
      <Input type="text" name="website" placeholder="Website" />
      {/* ... other fields ... */ }
      <Button type="submit">Complete Registration</Button>
    </form>
  );
};

export default RegisterOrganizationPage;
