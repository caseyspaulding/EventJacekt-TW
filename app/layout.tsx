// app/layout.tsx
import type { PropsWithChildren } from 'react';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import ClientProviders from './ClientProviders';
import { ThemeProvider } from "@/providers/theme-provider";
import Script from 'next/script';

// Google Font Configuration
const spaceGrotesk = Space_Grotesk( {
    weight: [ '400' ],
    subsets: [ 'latin' ],
    display: 'swap',
} );

export default function RootLayout ( { children }: PropsWithChildren )
{
    return (
        <html lang="en" className={ spaceGrotesk.className }>
            <body>
                {/* Google Tag Manager Script */ }
                <Script
                    strategy="afterInteractive"
                    src="https://www.googletagmanager.com/gtag/js?id=G-M6F4XVZM25"
                />
                <Script id="gtag-init" strategy="afterInteractive">
                    { `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-M6F4XVZM25');
          `}
                </Script>
                <ThemeProvider attribute="class" defaultTheme="light">
                    <ClientProviders>
                        { children }
                    </ClientProviders>
                </ThemeProvider>
            </body>
        </html>
    );
}
