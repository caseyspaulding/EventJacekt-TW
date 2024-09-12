// app/layout.tsx

import type { PropsWithChildren } from 'react';
import { Poppins, Space_Grotesk } from 'next/font/google';  // Import both fonts
import { twMerge } from 'tailwind-merge';
import './globals.css';
import ClientProviders from './ClientProviders';
import Head from 'next/head';




export const metadata = {
    title: 'EventJacket - Event Management Software',
    openGraph: {
        title: 'EventJacket - Event Management Software',
        description:
            'Simplify planning, boost ticket sales, and manage everything in one place. For every event, big or small..'
    }
};

// Load the fonts with specific weights
const poppins = Poppins( {
    weight: [ '400', '700' ], // Regular and Bold for headings
    subsets: [ 'latin' ],
    display: 'swap',
} );


const spaceGrotesk = Space_Grotesk( {  // Load Space Grotesk font
    weight: [ '400' ],  // Regular weight
    subsets: [ 'latin' ],
    display: 'swap',
} );


export default function RootLayout ( { children }: PropsWithChildren )
{
    return (
        <html lang="en" className={ `${ spaceGrotesk.className }` }>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>EventJacket - Save Thousands!</title>
                <meta name="description" content="Save Thousands! EventJacket empowers nonprofits to manage vendors, volunteers, attendees, performers, and sponsors in one platform without breaking the bank." />
                <meta property="og:title" content="EventJacket - Event Management Software" />
                <meta property="og:description" content="Save Thousands! EventJacket empowers nonprofits to manage vendors, volunteers, attendees, performers, and sponsors in one platform without breaking the bank." />
                <meta property="og:url" content="https://www.eventjacket.com" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://www.eventjacket.com/opengraph-image.png" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:alt" content="EventJacket - Save Thousands!" />
                <meta property="fb:app_id" content="453279560972900" />
                
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
                    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
                        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
                            <link rel="manifest" href="/site.webmanifest"/>
                                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/>
                                    <meta name="msapplication-TileColor" content="#da532c"/>
                                        <meta name="theme-color" content="#ffffff"/>
                <link rel="canonical" href="https://www.eventjacket.com" />
         
              
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
                <script src="https://connect.stripe.com/connect-js" async></script>
            </Head>

            <body className={ twMerge( 'bg-white dark:bg-gray-900' ) }>
              
                    <ClientProviders>
                        { children }
                    </ClientProviders>
       
            </body>
        </html>
    );
}
