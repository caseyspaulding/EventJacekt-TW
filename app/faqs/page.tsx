'use client'; 

import FAQ_TW from "@/components/FAQ/FAQ_TW";
import FooterFull from "@/components/Footers/FooterFull";
import { FAQSectionAsAccordion } from "@/components/marketing-ui/faq-sections/accordion";
import NavBar1 from "@/components/NavBarTW/NavBar1";

export default function FAQ() {
  return (
    <div>
     <NavBar1 />  
      <FAQ_TW />  
      <FooterFull />  
      </div>
  )
}