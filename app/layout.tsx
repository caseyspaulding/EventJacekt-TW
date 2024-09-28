// app/layout.tsx
import type { PropsWithChildren } from 'react';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import ClientProviders from './ClientProviders';
import { ThemeProvider } from "@/providers/theme-provider";

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
