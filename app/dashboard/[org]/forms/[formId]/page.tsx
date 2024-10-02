"use client";


import { FormEditorComponent } from '@/components/form-editor';
import { useUser } from '@/contexts/UserContext';

export default function NewForm ()
{
  const { user, loading } = useUser();  // Ensure this hook has proper context wrapping

  if ( loading ) return <div>Loading...</div>;
  if ( !user ) return <div>User not authenticated</div>;

  const orgId = user.organizationId;  // Ensure user object has organizationId

  return (
    <div>
      <FormEditorComponent orgId={ orgId } />
    </div>
  );
}
