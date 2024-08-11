'use client'; 

import FAQ_TW from "@/components/FAQ/FAQ_TW";
import FooterFull from "@/components/Footers/FooterFull";
import HeaderCentered from "@/components/HeaderCentered";
import { FAQSectionAsAccordion } from "@/components/marketing-ui/faq-sections/accordion";
import NavBar1 from "@/components/NavBarTW/NavBar1";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'FAQs - EventJacket',
  description: 'Got questions? We\'ve got answers. Check out our Frequently asked questions section to learn more about our platform.',
};

export default function FAQ() {
  return (
    <div>
      <NavBar1 />  
      <HeaderCentered
        title="FAQs"
        description="Got questions? We've got answers. Check out our Frequently asked questions section to learn more about our platform."
      />
      <FAQ_TW />  
      <FooterFull />  
      </div>
  )
}