"use client";

import { FormBuilderComponent } from '@/components/form-builder';
import { useUser } from '@/contexts/UserContext';

export default function NewForm ()
{
  const { user, loading } = useUser();  // Ensure this hook has proper context wrapping

  if ( loading ) return <div>Loading...</div>;
  if ( !user ) return <div>User not authenticated</div>;

  const orgId = user.organizationId;  // Ensure user object has organizationId

  return (
    <div>
      <FormBuilderComponent orgId={ orgId } />
    </div>
  );
}
