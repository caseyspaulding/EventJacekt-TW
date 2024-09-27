import type { PropsWithChildren } from 'react';
import { Space_Grotesk } from 'next/font/google';  // Import font
import './globals.css';
import ClientProviders from './ClientProviders';
import { ThemeProvider } from "@/providers/theme-provider";

import Head from 'next/head';
import { useRouter } from 'next/navigation';
// Metadata for SEO and OpenGraph
export const metadata = {
    title: 'EventJacket - Event Management Software for Nonprofits',
    description: 'EventJacket empowers nonprofits to manage vendors, volunteers, attendees, performers, and sponsors in one platform without breaking the bank.',
    canonical: 'https://eventjacket.com',  // Added Canonical URL
    openGraph: {
        title: 'EventJacket - Event Management Software',
        description: 'Save Thousands! EventJacket empowers nonprofits to manage vendors, volunteers, attendees, performers, and sponsors in one platform without breaking the bank.',
        url: 'https://eventjacket.com',  // Updated to preferred domain
        type: 'website',
        images: [
            {
                url: 'https://eventjacket.com/opengraph-image.png',  // Updated to preferred domain
                width: 1200,
                height: 630,
                alt: 'EventJacket - Save Thousands!',
            },
        ],
    },
    icons: {
        icon: [
            { rel: 'icon', type: 'image/png', sizes: '32x32', url: '/favicon-32x32.png' },
            { rel: 'icon', type: 'image/png', sizes: '16x16', url: '/favicon-16x16.png' }
        ],
        appleTouchIcon: '/apple-touch-icon.png',
        manifest: '/site.webmanifest',
        maskIcon: {
            url: '/safari-pinned-tab.svg',
            color: '#5bbad5',
        },
    },
};

// Google Font Configuration
const spaceGrotesk = Space_Grotesk( {
    weight: [ '400' ], // Regular weight
    subsets: [ 'latin' ],
    display: 'swap', // Fallback for font loading
} );

export default function RootLayout ( { children }: PropsWithChildren )
{


    return (
        <html lang="en" className={ `${ spaceGrotesk.className }` }>

            <body>
                <ThemeProvider attribute="class" defaultTheme="light">
                    <ClientProviders>
                        { children }
                    </ClientProviders>
                </ThemeProvider>
            </body>
        </html>
    );
}
