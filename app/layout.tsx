import { Flowbite } from 'flowbite-react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';
import { customTheme } from './theme';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import { AnnouncementBanner } from '@/components/marketing-ui/banners/announcement';


const inter = Inter( { subsets: [ 'latin' ], display: 'swap' } );

export default function RootLayout ( { children }: PropsWithChildren )
{
    return (
        <html lang="en">
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
                    rel="stylesheet"
                    type="text/css"
                />
                {/* Inline script to set theme */ }
                <script
                    dangerouslySetInnerHTML={ {
                        __html: `
                            (function() {
                                const theme = localStorage.getItem('theme') || 'light';
                                document.documentElement.classList.add(theme);
                            })();
                        `,
                    } }
                />
            </head>
            <body className={ twMerge( 'bg-white dark:bg-gray-900', inter.className ) }>
                <AnnouncementBanner />
                <Toaster />
                <Flowbite theme={ { theme: customTheme } }>{ children }</Flowbite>
            </body>
        </html>
    );
}
