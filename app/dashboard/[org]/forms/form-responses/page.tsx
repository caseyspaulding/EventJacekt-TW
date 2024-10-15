'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@utils/supabase/client';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LogoSpinner from '@/components/Loaders/LogoSpinner';

interface FormResponse
{
  id: string;
  formId: string;
  orgId: string;
  responseData: Record<string, any>;
  submittedAt: string;
}

export default function FormResponsesPage ()
{
  const [ formResponses, setFormResponses ] = useState<FormResponse[]>( [] );
  const [ loading, setLoading ] = useState( true );
  const [ error, setError ] = useState<string | null>( null );

  useEffect( () =>
  {
    async function fetchFormResponses ()
    {
      const supabase = createClient();

      try
      {
        setLoading( true );
        const { data: responsesData, error: responsesError } = await supabase
          .from( 'form_responses' )
          .select( '*' )
          .order( 'submitted_at', { ascending: false } );

        if ( responsesError )
        {
          setError( 'Failed to fetch form responses' );
          console.error( 'Failed to fetch form responses:', responsesError );
          return;
        }

        setFormResponses( responsesData );
      } catch ( error )
      {
        setError( 'Failed to fetch form responses' );
        console.error( 'Error fetching form responses:', error );
      } finally
      {
        setLoading( false );
      }
    }

    fetchFormResponses();
  }, [] );

  if ( loading )
  {
    return (
      <div className="flex justify-center items-center h-screen">
        <LogoSpinner />
      </div>
    );
  }

  if ( error )
  {
    return <p className="text-red-600 text-center">{ error }</p>;
  }

  return (
    <div className="">
      <Card>
        <CardHeader>
          <CardTitle>Form Responses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {/* Hide table on small screens */ }
            <table className="hidden sm:table min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Form ID
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization ID
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted At
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                { formResponses.length > 0 ? (
                  formResponses.map( ( response ) => (
                    <tr key={ response.id }>
                      <td className="px-2 py-2 text-sm font-medium text-gray-900">
                        { response.formId }
                      </td>
                      <td className="px-2 py-2 text-sm text-gray-500">
                        { response.orgId }
                      </td>
                      <td className="px-2 py-2 text-sm text-gray-500">
                        { new Date( response.submittedAt ).toLocaleString() }
                      </td>
                      <td className="px-2 py-2 text-sm font-medium">
                        <Link href={ `/dashboard/forms/${ response.id }` }>
                          <div className="text-blue-600 hover:text-blue-900">View Details</div>
                        </Link>
                      </td>
                    </tr>
                  ) )
                ) : (
                  <tr>
                    <td colSpan={ 4 } className="px-2 py-2 text-center text-sm text-gray-500">
                      No form responses found.
                    </td>
                  </tr>
                ) }
              </tbody>
            </table>
            {/* Stack layout on small screens */ }
            <div className="sm:hidden">
              { formResponses.length > 0 ? (
                formResponses.map( ( response ) => (
                  <div
                    key={ response.id }
                    className="border rounded-lg mb-2 p-2 divide-y divide-gray-200"
                  >
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-900">Form ID:</span>
                      <span className="text-gray-700">{ response.formId }</span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="font-medium text-gray-900">Organization ID:</span>
                      <span className="text-gray-700">{ response.orgId }</span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="font-medium text-gray-900">Submitted At:</span>
                      <span className="text-gray-700">
                        { new Date( response.submittedAt ).toLocaleString() }
                      </span>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Link href={ `/dashboard/forms/${ response.id }` }>
                        <div className="text-blue-600 hover:text-blue-900">View Details</div>
                      </Link>
                    </div>
                  </div>
                ) )
              ) : (
                <p className="text-center text-sm text-gray-500">No form responses found.</p>
              ) }
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
