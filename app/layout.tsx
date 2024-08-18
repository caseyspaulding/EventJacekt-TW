import { Flowbite } from 'flowbite-react';

import { Inter } from 'next/font/google';
import type { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';
import { customTheme } from './theme';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata = {
    title: 'EventJacket - Event Management Platform for Non-Profits',
    openGraph: {
        title: 'EventJacket - Event Management Platform for Non-Profits',
        description:
            'EventJacket is your all-in-one event management solution, offering tools to create, manage, and sell tickets for events with ease. Perfect for organizers of conferences, festivals, and more.'
    }
};
const inter = Inter({ subsets: ['latin'], display: 'swap' });

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />

                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
                    rel="stylesheet"
                    type="text/css"
                />
                {/* Inline script to set theme */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function() {
                                const theme = localStorage.getItem('theme') || 'light';
                                document.documentElement.classList.add(theme);
                            })();
                        `
                    }}
                />
            </head>
            <body className={twMerge('bg-white dark:bg-gray-900', inter.className)}>
                <Toaster />
                <Flowbite theme={{ theme: customTheme }}>{children}</Flowbite>
            </body>
        </html>
    );
}
