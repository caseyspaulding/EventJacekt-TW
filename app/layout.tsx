import type { PropsWithChildren } from 'react';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Script from 'next/script';

const ClientProviders = dynamic( () => import( './ClientProviders' ), {
    ssr: false,
} );

export const metadata = {
    title: 'EventJacket - Event Management CRM',
    description: 'EventJacket empowers nonprofits to manage vendors, volunteers, attendees, performers, and sponsors in one platform without breaking the bank.',
    openGraph: {
        title: 'EventJacket - Event Management Software',
        description: 'Save Thousands! EventJacket empowers nonprofits to manage vendors, volunteers, attendees, performers, and sponsors in one platform without breaking the bank.',
        url: 'https://www.eventjacket.com',
        type: 'website',
        images: [
            {
                url: 'https://www.eventjacket.com/opengraph-image.png',
                width: 1200,
                height: 630,
                alt: 'EventJacket - Save Thousands!',
            },
        ],
    },
    themeColor: '#ffffff',
    other: {
        'msapplication-TileColor': '#da532c',
    },
};

const spaceGrotesk = Space_Grotesk( {
    weight: [ '400' ],
    subsets: [ 'latin' ],
    display: 'optional',
} );

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={spaceGrotesk.className}>
          <Head>
              <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
              <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
              <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
              <link rel="manifest" href="/site.webmanifest" />
              <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
              <link rel="canonical" href="https://www.eventjacket.com" />

              {/* Preload critical assets */ }
              <link rel="preload" href="/images/video-thumbnail.webp" as="image" />

              {/* Preconnect to external resources */ }
              <link rel="preconnect" href="https://www.googletagmanager.com" />
              <link rel="preconnect" href="https://fonts.gstatic.com" />

              {/* Preload and load fonts asynchronously */ }
              <link
                  rel="preload"
                  href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400&display=swap"
                  as="style"
                  
              />
              <noscript>
                  <link
                      rel="stylesheet"
                      href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400&display=swap"
                  />
              </noscript>
          </Head>
      <body>
        <ClientProviders>{children}</ClientProviders>

        {/* Non-essential Scripts: Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-M6F4XVZM25"
          strategy="lazyOnload"
        />
        <Script id="google-analytics-inline" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-M6F4XVZM25', {
              'anonymize_ip': true,
              'send_page_view': false
            });
          `}
        </Script>
      </body>
    </html>
  );
}
