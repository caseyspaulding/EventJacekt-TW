// app/layout.tsx

import type { PropsWithChildren } from 'react';
import { Poppins } from 'next/font/google';
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
const montserrat = Poppins( {
    weight: [ '400', '700' ], // Regular and Bold for headings
    subsets: [ 'latin' ],
    display: 'swap',
} );

export default function RootLayout ( { children }: PropsWithChildren )
{
    return (
        <html lang="en" className={ `${ montserrat.className }` }>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>EventJacket - Event Management Software</title>
                <meta name="description" content="Simplify planning, boost ticket sales, and manage everything in one place. For every event, big or small." />
                <meta property="og:title" content="EventJacket - Event Management Software" />
                <meta property="og:description" content="Simplify planning, boost ticket sales, and manage everything in one place. For every event, big or small." />
                <meta property="og:url" content="https://www.eventjacket.com" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://www.eventjacket.com/opengraph-image.png" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:alt" content="EventJacket - Your Event Management Solution" />
                <meta property="fb:app_id" content="453279560972900" />
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
            </Head>

            <body className={ twMerge( 'bg-white dark:bg-gray-900' ) }>
              
                    <ClientProviders>
                        { children }
                    </ClientProviders>
       
            </body>
        </html>
    );
}
