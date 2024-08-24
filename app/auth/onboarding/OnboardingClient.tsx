'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
export const dynamic = 'force-dynamic';
const Onboarding = () =>
{
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get( 'userId' );
  const [ orgName, setOrgName ] = useState( '' );
  const supabase = createClient();

  useEffect( () =>
  {
    if ( !userId )
    {
      // If no userId is provided in the URL, redirect to the sign-in page
      router.push( '/auth/sign-in' );
    }
  }, [ userId, router ] );

  const handleSubmit = async ( e: React.FormEvent<HTMLFormElement> ) =>
  {
    e.preventDefault();

    if ( !orgName )
    {
      alert( 'Organization name is required' );
      return;
    }

    try
    {
      // Fetch user profile from Supabase if needed
      const { data: profile, error: profileError } = await supabase
        .from( 'user_profiles' )
        .select( 'id' )
        .eq( 'user_id', userId )
        .single();

      if ( profileError || !profile )
      {
        throw new Error( 'Could not fetch user profile' );
      }

      // Insert organization and update user profile
      const { data: org, error: orgError } = await supabase
        .from( 'organizations' )
        .insert( { name: orgName } )
        .select()
        .single();

      if ( orgError || !org )
      {
        throw new Error( 'Failed to create organization' );
      }

      const { error: updateProfileError } = await supabase
        .from( 'user_profiles' )
        .update( { org_id: org.id, organization_name: orgName } )
        .eq( 'user_id', userId );

      if ( updateProfileError )
      {
        throw new Error( 'Failed to update user profile' );
      }

      // Redirect to the dashboard
      router.push( `/dashboard/${ encodeURIComponent( orgName ) }` );
    } catch ( error )
    {
      console.error( 'Onboarding error:', error );
      alert( 'An error occurred during onboarding.' );
    }
  };

  return (
    <div>
      <h1>Complete Your Onboarding</h1>
      <form onSubmit={ handleSubmit }>
        <div>
          <label>Organization Name</label>
          <input
            type="text"
            value={ orgName }
            onChange={ ( e ) => setOrgName( e.target.value ) }
            required
          />
        </div>
        {/* Add more fields as necessary */ }
        <button type="submit">Complete Onboarding</button>
      </form>
    </div>
  );
};

export default Onboarding;
