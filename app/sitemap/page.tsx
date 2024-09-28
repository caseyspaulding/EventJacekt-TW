// app/sitemap/page.tsx

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
        <title>Site Map - EventJacket</title>
        <meta
          name="description"
          content="Explore all the pages of EventJacket, including our blog, tools, events, and more."
        />
        <meta property="og:title" content="Site Map - EventJacket" />
        <meta
          property="og:description"
          content="Discover the full site map for EventJacket, your go-to event management solution."
        />
        <meta property="og:url" content="https://eventjacket.com/sitemap" />
        <meta property="og:type" content="website" />
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
