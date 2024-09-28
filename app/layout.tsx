import type { PropsWithChildren } from 'react';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import ClientProviders from './ClientProviders';
import { ThemeProvider } from "@/providers/theme-provider";
import { usePathname } from 'next/navigation';
import Head from 'next/head';

// Google Font Configuration
const spaceGrotesk = Space_Grotesk( {
    weight: [ '400' ],
    subsets: [ 'latin' ],
    display: 'swap',
} );

export default function RootLayout ( { children }: PropsWithChildren )
{
    const pathname = usePathname();

    // Build the canonical URL dynamically based on the current route
    const canonicalUrl = `https://eventjacket.com${ pathname === '/' ? '' : pathname }`;

    return (
        <html lang="en" className={ `${ spaceGrotesk.className }` }>
            <Head>
                {/* Canonical URL */ }
                <link rel="canonical" href={ canonicalUrl } />
            </Head>
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
