import type { PropsWithChildren } from 'react';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import ClientProviders from './ClientProviders';
import { ThemeProvider } from '@/providers/theme-provider';
import Head from 'next/head';

// Google Font Configuration
const spaceGrotesk = Space_Grotesk( {
    weight: [ '400' ],
    subsets: [ 'latin' ],
    display: 'swap',
} );

export default function RootLayout ( { children }: PropsWithChildren )
{
    return (
        <html lang="en" className={ `${ spaceGrotesk.className }` }>
            <Head>
                {/* Google Tag Manager (gtag.js) */ }
                <script
                    async
                    src="https://www.googletagmanager.com/gtag/js?id=G-M6F4XVZM25"
                ></script>
                <script
                    dangerouslySetInnerHTML={ {
                        __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-M6F4XVZM25');
            `,
                    } }
                />
            </Head>
            <body>
                <ThemeProvider attribute="class" defaultTheme="light">
                    <ClientProviders>{ children }</ClientProviders>
                </ThemeProvider>
            </body>
        </html>
    );
}
