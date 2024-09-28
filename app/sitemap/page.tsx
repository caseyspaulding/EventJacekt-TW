import React from 'react';
import Link from 'next/link';
import NavBar1 from '@/components/NavBarTW/NavBar1';
import FooterFull from '@/components/Footers/FooterFull';
import Head from 'next/head';

const Sitemap = () =>
{
  return (
    <>
      <Head>
        {/* Primary SEO Meta Tags */ }
        <title>Site Map - EventJacket</title>
        <meta
          name="description"
          content="Explore all the pages of EventJacket, including our blog, tools, events, and resources to help you manage your events seamlessly."
        />
        <meta name="keywords" content="Event management, event software, sitemap, nonprofit events, EventJacket" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://eventjacket.com/sitemap" />

        {/* Open Graph Meta Tags for Social Sharing */ }
        <meta property="og:title" content="Site Map - EventJacket" />
        <meta
          property="og:description"
          content="Discover the full site map for EventJacket, your go-to event management solution for nonprofits. Navigate through our tools, blog, events, and more."
        />
        <meta property="og:url" content="https://eventjacket.com/sitemap" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://eventjacket.com/images/opengraph-sitemap.png" />
        <meta property="og:site_name" content="EventJacket" />

        {/* Twitter Card Meta Tags */ }
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Site Map - EventJacket" />
        <meta
          name="twitter:description"
          content="Explore the full site map for EventJacket to find our blog, free tools, event management services, and more."
        />
        <meta name="twitter:image" content="https://eventjacket.com/images/opengraph-sitemap.png" />
        <meta name="twitter:site" content="@EventJacket" />
        <meta name="twitter:creator" content="@EventJacket" />

        {/* Favicon and App Icons */ }
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      <NavBar1 />
      <div className="bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Site Map</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* General Information Section */ }
            <div>
              <h3 className="font-bold text-xl mb-4">General Information</h3>
              <ul>
                <li>
                  <Link href="/">
                    <p className="text-blue-600 hover:underline">Home</p>
                  </Link>
                </li>
                <li>
                  <Link href="/about">
                    <p className="text-blue-600 hover:underline">About Us</p>
                  </Link>
                </li>
                <li>
                  <Link href="/pricing">
                    <p className="text-blue-600 hover:underline">Fees</p>
                  </Link>
                </li>
                <li>
                  <Link href="/contact">
                    <p className="text-blue-600 hover:underline">Contact Us</p>
                  </Link>
                </li>
                <li>
                  <Link href="/terms">
                    <p className="text-blue-600 hover:underline">Terms of Service</p>
                  </Link>
                </li>
                <li>
                  <Link href="/privacy">
                    <p className="text-blue-600 hover:underline">Privacy Policy</p>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Holding Events Section */ }
            <div>
              <h3 className="font-bold text-xl mb-4">Holding Events</h3>
              <ul>
                <li>
                  <Link href="/signup">
                    <p className="text-blue-600 hover:underline">Sign up to hold events</p>
                  </Link>
                </li>
                <li>
                  <Link href="/login">
                    <p className="text-blue-600 hover:underline">Login</p>
                  </Link>
                </li>
                <li>
                  <Link href="/ticketing">
                    <p className="text-blue-600 hover:underline">Selling Tickets</p>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Attending Events Section */ }
            <div>
              <h3 className="font-bold text-xl mb-4">Attending Events</h3>
              <ul>
                <li>
                  <Link href="/events">
                    <p className="text-blue-600 hover:underline">Browse Events</p>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Categories Section */ }
            <div>
              <h3 className="font-bold text-xl mb-4">Guides</h3>
              <ul>
                <li>
                  <Link href="/blog">
                    <p className="text-blue-600 hover:underline">Blog</p>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Free Tools Section */ }
            <div>
              <h3 className="font-bold text-xl mb-4">Free Tools</h3>
              <ul>
                <li>
                  <Link href="/qrcode">
                    <p className="text-blue-600 hover:underline">QR code generator</p>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <FooterFull />
    </>
  );
};

export default Sitemap;
