// app/layout.tsx

import type { PropsWithChildren } from 'react';
import {Poppins } from 'next/font/google'; // Correct font import path for Next.js 13 and 14
import { twMerge } from 'tailwind-merge';
import './globals.css';
import ClientProviders from './ClientProviders';

export const metadata = {
    title: 'EventJacket - Event Management Software',
    openGraph: {
        title: 'EventJacket - Event Management Software',
        description:
            'Simplify planning, boost ticket sales, and manage everything in one place. For every event, big or small..'
    }
};

// Load the fonts with specific weights
const montserrat = Poppins( {
    weight: [ '400', '700' ], // Regular and Bold for headings
    subsets: [ 'latin' ],
    display: 'swap',
} );



export default function RootLayout ( { children }: PropsWithChildren )
{
    return (
        <html lang="en" className={ `${ montserrat.className }` }>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                {/* Inline script to set theme */ }
                <script
                    dangerouslySetInnerHTML={ {
                        __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 'light';
                document.documentElement.classList.add(theme);
              })();
            `
                    } }
                />
                <script src="https://accounts.google.com/gsi/client" async></script>
            </head>

            <body className={ twMerge( 'bg-white dark:bg-gray-900' ) }>
                <ClientProviders>
                    { children }
                </ClientProviders>
            </body>
        </html>
    );
}
