// /app/dashboard/[orgName]/profile/page.tsx


import { fetchUserProfile } from '@/app/actions/fetchUserProfile'; // Fetch user profile action
import { useUser } from '@/contexts/UserContext'; // User context hook
import { redirect } from 'next/navigation';

export  default async function ProfilePage ( { params }: { params: { orgName: string } } )
{
  const { orgName } = params;
  const { user } = useUser(); // Fetch the user data from the context

  if ( !user )
  {
    return <div>Loading...</div>; // Or redirect to login
  }

  const userProfile = await fetchUserProfile();

  if ( !userProfile )
  {
    // If user profile is not found, you might want to redirect or show an error
    redirect( '/login' );
    return null; // You might want to return null or a loading state here
  }


  return (
    <div>
      <h1 className="text-2xl font-bold">Profile Page</h1>
      <p className="mt-2 text-sm text-gray-500">
        Welcome to the profile page for { user.email } in organization { orgName }.
      </p>
      {/* Render more profile details here */ }
      <p>Email: { userProfile.email }</p>
      <p>Role: { userProfile.role }</p>
      {/* Add more user details here */ }
    </div>
  );
}
