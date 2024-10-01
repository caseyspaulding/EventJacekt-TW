'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@utils/supabase/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
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
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Form Responses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Form ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                { formResponses.length > 0 ? (
                  formResponses.map( ( response ) => (
                    <tr key={ response.id }>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{ response.formId }</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{ response.orgId }</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{ new Date( response.submittedAt ).toLocaleString() }</td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <Link href={ `/dashboard/forms/${ response.id }` }>
                          <div className="text-blue-600 hover:text-blue-900">View Details</div>
                        </Link>
                      </td>
                    </tr>
                  ) )
                ) : (
                  <tr>
                    <td colSpan={ 4 } className="px-6 py-4 text-center text-sm text-gray-500">
                      No form responses found.
                    </td>
                  </tr>
                ) }
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
