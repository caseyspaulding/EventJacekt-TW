// app/ThemeProvider.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext( {
  theme: 'light',
  toggleTheme: () => { },
} );

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ( { children } ) =>
{
  const [ theme, setTheme ] = useState<'light' | 'dark'>( 'light' );

  useEffect( () =>
  {
    const storedTheme = localStorage.getItem( 'theme' ) as 'light' | 'dark' | null;
    if ( storedTheme )
    {
      setTheme( storedTheme );
      document.documentElement.classList.add( storedTheme );
    }
  }, [] );

  const toggleTheme = () =>
  {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme( newTheme );
    localStorage.setItem( 'theme', newTheme );
    document.documentElement.classList.remove( theme );
    document.documentElement.classList.add( newTheme );
  };

  return (
    <ThemeContext.Provider value={ { theme, toggleTheme } }>
      { children }
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext( ThemeContext );