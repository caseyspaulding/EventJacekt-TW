// app/layout.tsx
import type { PropsWithChildren } from 'react';
import { Space_Grotesk } from 'next/font/google';  // Import both fonts

import './globals.css';
import ClientProviders from './ClientProviders';


export const metadata = {
    title: 'EventJacket - Nonprofit CRM',
    description: 'EventJacket empowers nonprofits to manage vendors, volunteers, attendees, performers, and sponsors in one platform without breaking the bank.',
    openGraph: {
        title: 'EventJacket - Event Management Software',
        description: 'Save Thousands! EventJacket empowers nonprofits to manage vendors, volunteers, attendees, performers, and sponsors in one platform without breaking the bank.',
        url: 'https://www.eventjacket.com',
        type: 'website',
        images: [
            {
                url: 'https://www.eventjacket.com/opengraph-image.png',
                width: 1200,
                height: 630,
                alt: 'EventJacket - Save Thousands!',
            },
        ],
    },
    other: {
        'msapplication-TileColor': '#da532c',
    },
};

export const viewport = {
    themeColor: '#ffffff', // Move themeColor here
};


const spaceGrotesk = Space_Grotesk( {
    weight: [ '400' ], // Regular weight
    subsets: [ 'latin' ],
    display: 'swap',
} );

export default function RootLayout ( { children }: PropsWithChildren )
{
    return (
        <html lang="en" className={ `${ spaceGrotesk.className }` }>
            <head>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />

                <link rel="canonical" href="https://www.eventjacket.com" />


            </head>
            <body >


                <ClientProviders>
                    { children }
                </ClientProviders>
            </body>
        </html>
    );
}
