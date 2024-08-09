// contexts/UserContext.tsx
'use client'; 
import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserType = {
  id: string;
  email: string;
  orgName: string;
  organizationId: string;
};

type UserContextType = {
  user: UserType | null;
  setUser: ( user: UserType | null ) => void;
  loading: boolean;
};

const UserContext = createContext<UserContextType | undefined>( undefined );

export function UserProvider ( { children, user: initialUser }: { children: ReactNode; user: UserType | null } )
{
  const [ user, setUser ] = useState<UserType | null>( initialUser );
  const [ loading, setLoading ] = useState( false );

  return (
    <UserContext.Provider value={ { user, setUser, loading } }>
      { children }
    </UserContext.Provider>
  );
}

export function useUser ()
{
  const context = useContext( UserContext );
  if ( context === undefined )
  {
    throw new Error( 'useUser must be used within a UserProvider' );
  }
  return context;
}
