


import SlantedDivider2 from "@/components/Divider/SlantedDivider2";
import SlantedDivider3 from "@/components/Divider/SlantedDivider3";
import SlantedDividerSolid from "@/components/Divider/SlantedDividerSolidProps";
import SlantedOverlap, { SlantedDivider } from "@/components/Divider/SlantedOverLap";
import NavBar1 from "@/components/NavBarTW/NavBar1";

import CTAwPicture from "@components/CTA/CTAwPicture";
import FeaturesGridWithIcons from "@components/Features/FeaturesGridwithIcons";
import FooterFull from "@components/Footers/FooterFull";
import NavBarTW from "@components/NavBarTW/NavBarTW";
import { Metadata } from "next";



export const metadata: Metadata = {
  title: 'EventJacket - Event Management Platform for Non-Profits',
  description: 'EventJacket is your all-in-one event management solution, offering tools to create, manage, and sell tickets for events with ease. Perfect for organizers of conferences, festivals, and more.',
};

export default async function Index ()
{
  return (
    <>

      <NavBar1 />

      <NavBarTW />
      <SlantedDividerSolid color="#f1f5f9" height="80px"  />



      <FeaturesGridWithIcons />
      <SlantedDividerSolid color="#f1f5f9" height="80px" flip invert zIndex={ 2 } />
      <SlantedDividerSolid color="transparent" height="80px"  zIndex={ 1 } />
      
      
      

      <FooterFull />

    </>
  );
}
