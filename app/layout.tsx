import type { PropsWithChildren } from 'react';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import dynamic from 'next/dynamic';
import Head from 'next/head';


// Dynamically import ClientProviders to reduce main thread work
const ClientProviders = dynamic( () => import( './ClientProviders' ), {
    ssr: false,
} );

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
    themeColor: '#ffffff',
    other: {
        'msapplication-TileColor': '#da532c',
    },
};

const spaceGrotesk = Space_Grotesk( {
    weight: [ '400' ],
    subsets: [ 'latin' ],
    display: 'optional', // Optimized font loading
} );

export default function RootLayout ( { children }: PropsWithChildren )
{
    return (
        <html lang="en" className={ spaceGrotesk.className }>
            <Head>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
                <link rel="canonical" href="https://www.eventjacket.com" />
     
            </Head>
            <body>
                {/* Include Google Analytics Script with lazy loading */ }
             
                <ClientProviders>
                    { children }
                </ClientProviders>
            </body>
        </html>
    );
}
