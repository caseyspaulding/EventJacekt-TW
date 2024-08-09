'use client'; 

import FAQ_TW from "@/components/FAQ/FAQ_TW";
import FooterFull from "@/components/Footers/FooterFull";
import HeaderCentered from "@/components/HeaderCentered";
import { FAQSectionAsAccordion } from "@/components/marketing-ui/faq-sections/accordion";
import NavBar1 from "@/components/NavBarTW/NavBar1";

export default function FAQ() {
  return (
    <div>
      <NavBar1 />  
      <HeaderCentered
        title="Frequently asked questions"
        description="Got questions? We've got answers. Check out our FAQ section to learn more about our platform."
      />
      <FAQ_TW />  
      <FooterFull />  
      </div>
  )
}