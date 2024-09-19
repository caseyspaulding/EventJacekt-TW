'use client';

import React from 'react';
import Link from 'next/link';
import NavBar1 from '@/components/NavBarTW/NavBar1';
import FooterFull from '@/components/Footers/FooterFull';

const Sitemap = () =>
{
  return ( <>
    <NavBar1 />
    <div className="bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Site Map</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* General Information Section */ }
          <div>
            <h3 className="font-bold text-xl mb-4">General Information</h3>
            <ul>
              <li><Link href="/"><p className="text-blue-600 hover:underline">Home</p></Link></li>
              <li><Link href="/pbout"><p className="text-blue-600 hover:underline">About Us</p></Link></li>
           
              <li><Link href="/pricing"><p className="text-blue-600 hover:underline">Fees</p></Link></li>
              <li><Link href="/contact"><p className="text-blue-600 hover:underline">Contact Us</p></Link></li>
              <li><Link href="/terms"><p className="text-blue-600 hover:underline">Terms of Service</p></Link></li>
              <li><Link href="/privacy"><p className="text-blue-600 hover:underline">Privacy Policy</p></Link></li>
              {/* Add more links as needed */ }
            </ul>
          </div>

          {/* Holding Events Section */ }
          <div>
            <h3 className="font-bold text-xl mb-4">Holding Events</h3>
            <ul>
              <li><Link href="/getting-started"><p className="text-blue-600 hover:underline">Getting Started</p></Link></li>
              <li><Link href="/how-it-works"><p className="text-blue-600 hover:underline">How It Works</p></Link></li>
              <li><Link href="/sell-tickets"><p className="text-blue-600 hover:underline">Sell Tickets</p></Link></li>
              <li><Link href="/online-registration"><p className="text-blue-600 hover:underline">Online Event Registration</p></Link></li>
              <li><Link href="/accept-payments"><p className="text-blue-600 hover:underline">Accept Payments</p></Link></li>
              {/* Add more links as needed */ }
            </ul>
          </div>

          {/* Attending Events Section */ }
          <div>
            <h3 className="font-bold text-xl mb-4">Attending Events</h3>
            <ul>
              <li><Link href="/events"><p className="text-blue-600 hover:underline">Browse Events</p></Link></li>
             
            </ul>
          </div>

          {/* Cptegories Section */ }
          <div>
            <h3 className="font-bold text-xl mb-4">Categories</h3>
            <ul>
              <li><Link href="/nonprofits"><p className="text-blue-600 hover:underline">Nonprofit Event Ticketing</p></Link></li>
              <li><Link href="/workshop-ticketing"><p className="text-blue-600 hover:underline">Workshop Ticketing</p></Link></li>
              <li><Link href="/ren-faire-ticketing"><p className="text-blue-600 hover:underline">Ren Faire Ticketing</p></Link></li>
             
              {/* Add more categories as needed */ }
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
