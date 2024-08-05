/* eslint-disable @next/next/no-page-custom-font */
import { Flowbite, ThemeModeScript } from 'flowbite-react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';
import { customTheme } from './theme';

import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
    title: 'EventJacket',
    description:
        'All-in-one event management platform for nonprofits, schools, and businesses. Manage events, sell tickets, and engage with your audience.'
};

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <html lang="en">
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
                    rel="stylesheet"
                    type="text/css"
                />
                <ThemeModeScript />
            </head>
            <body className={twMerge('bg-gray-50 dark:bg-gray-900', inter.className)}>
                <Flowbite theme={{ theme: customTheme }}>{children}</Flowbite>
            </body>
        </html>
    );
}
