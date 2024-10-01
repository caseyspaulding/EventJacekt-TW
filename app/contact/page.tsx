import FooterFull from "@/components/Footers/FooterFull";
import NavBar1 from "@/components/NavBarTW/NavBar1";
import { Metadata } from "next";
import React from "react";


export const metadata: Metadata = {
  title: 'Contact Us - EventJacket',
  description:
    'Get in touch with the EventJacket team. We’d love to hear from you! Send us a message using the form below, or email us directly at',
};
export default function Contact ()
{
  return (<>
    <NavBar1 /> 
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-16 divide-y divide-gray-100 lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Contact Us</h1>
              <p className="mt-4 leading-7 text-gray-600">
                We’d love to hear from you! Send us a message using the form below, or email us directly at{' '}
                <a href="mailto:team@eventjacket.com" className="font-semibold text-blue-600">  team@eventjacket.com </a> 
                <div className="mt-1">
                  <dt className="sr-only">Phone number</dt>
                  <dd>+1 (407) 326-3692</dd>
                </div>
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2 lg:gap-8">
              <div className="rounded-2xl bg-gray-50 p-10">
                <h3 className="text-base font-semibold leading-7 text-gray-900">Collaborate</h3>
                <dl className="mt-3 space-y-1 text-sm leading-6 text-gray-600">
                  <div>
                    <dt className="sr-only">Email</dt>
                    <dd>
                      <a href="mailto:team@eventjacket.com" className="font-semibold text-blue-600">
                        collaborate@eventjacket.com
                      </a>
                    </dd>
                  </div>
                  <div className="mt-1">
                   
                  </div>
                </dl>
              </div>
              <div className="rounded-2xl bg-gray-50 p-10">
                <h3 className="text-base font-semibold leading-7 text-gray-900">Press</h3>
                <dl className="mt-3 space-y-1 text-sm leading-6 text-gray-600">
                  <div>
                    <dt className="sr-only">Email</dt>
                    <dd>
                      <a href="mailto:team@eventjacket.com" className="font-semibold text-blue-600">
                        press@eventjacket.com
                      </a>
                    </dd>
                  </div>
                  
                </dl>
              </div>
              <div className="rounded-2xl bg-gray-50 p-10">
                <h3 className="text-base font-semibold leading-7 text-gray-900">Join our team</h3>
                <dl className="mt-3 space-y-1 text-sm leading-6 text-gray-600">
                  <div>
                    <dt className="sr-only">Email</dt>
                    <dd>
                      <a href="mailto:team@eventjacket.com" className="font-semibold text-blue-600">
                        careers@eventjacket.com
                      </a>
                    </dd>
                  </div>
                  
                </dl>
              </div>
              
            </div>
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 pt-16 lg:grid-cols-3">
            
          </div>
        </div>
      </div>
    </div>
    <FooterFull />  
  </>
  )
}
