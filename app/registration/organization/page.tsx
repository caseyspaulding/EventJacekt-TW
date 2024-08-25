'use client';

import { useState } from 'react';
import { registerOrganization } from './registerOrganization'; // Update with correct path
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const RegisterOrganizationPage = () =>
{
  const router = useRouter();
  const [ orgName, setOrgName ] = useState( '' );
  const [ website, setWebsite ] = useState( '' );
  const [ logoFile, setLogoFile ] = useState<File | null>( null );
  const [ loading, setLoading ] = useState( false );

  const handleSubmit = async ( e: React.FormEvent ) =>
  {
    e.preventDefault();
    setLoading( true );

    const formData = new FormData();
    formData.append( 'orgName', orgName );
    formData.append( 'website', website );
    if ( logoFile )
    {
      formData.append( 'logo', logoFile );
    }

    const response = await registerOrganization( formData );

    setLoading( false );

    if ( response.success )
    {
      toast.success( 'Organization registered successfully!' );
      // Small delay before navigating
      setTimeout( () =>
      {
        router.push( `/dashboard/${ response.orgName }` );
      }, 200 );
    } else
    {
      toast.error( 'Error creating organization' );
    }
  };

  return (
    <div className="pt-8 flex min-h-screen items-center justify-center bg-gray-100">
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
        <div className="px-4 sm:px-0">
          <img src="/images/logo.svg" alt="EventJacket" className="h-12 w-auto" />
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Organization Registration
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Please provide the details of your organization to complete the registration.
          </p>
        </div>

        <form onSubmit={ handleSubmit } className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Organization Name
            </label>
            <input
              type="text"
              name="orgName"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={ orgName }
              onChange={ ( e ) => setOrgName( e.target.value ) }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Website
            </label>
            <input
              type="url"
              name="website"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={ website }
              onChange={ ( e ) => setWebsite( e.target.value ) }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Logo
            </label>
            <input
              type="file"
              name="logo"
              accept="image/*"
              onChange={ ( e ) => setLogoFile( e.target.files ? e.target.files[ 0 ] : null ) }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            disabled={ loading }
          >
            { loading ? 'Registering...' : 'Register Organization' }
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterOrganizationPage;
