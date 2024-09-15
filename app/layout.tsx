// app/layout.tsx
import type { PropsWithChildren } from 'react';
import { Space_Grotesk } from 'next/font/google';
import { twMerge } from 'tailwind-merge';
import './globals.css';
import ClientProviders from './ClientProviders';
import Script from 'next/script';
import { ThemeProvider } from './ThemeProvider'; // New import

export const metadata = {
    // ... (keep your existing metadata)
};

const spaceGrotesk = Space_Grotesk( {
    weight: [ '400' ],
    subsets: [ 'latin' ],
    display: 'swap',
    variable: '--font-space-grotesk', // Add this line
} );

export default function RootLayout ( { children }: PropsWithChildren )
{
    return (
        <html lang="en" className={ `${ spaceGrotesk.variable }` }>
            <head>
                {/* Keep your existing link tags */ }
                <link rel="preconnect" href="https://www.googletagmanager.com" />
                <link rel="preconnect" href="https://accounts.google.com" />
                <link rel="preconnect" href="https://connect.stripe.com" />
            </head>
            <body className={ twMerge( 'bg-white dark:bg-gray-900', spaceGrotesk.className ) }>
                <Script src="https://www.googletagmanager.com/gtag/js?id=G-M6F4XVZM25" strategy="afterInteractive" />
                <Script id="google-analytics" strategy="afterInteractive">
                    { `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-M6F4XVZM25');
                    `}
                </Script>

                <Script src="https://accounts.google.com/gsi/client" strategy="lazyOnload" />
                <Script src="https://connect.stripe.com/connect-js" strategy="lazyOnload" />

                <ThemeProvider>
                    <ClientProviders>
                        { children }
                    </ClientProviders>
                </ThemeProvider>
            </body>
        </html>
    );
}