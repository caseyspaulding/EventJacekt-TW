


import SvgBackgroundReversed from "@/components/Backgrounds/SquareSvgBackgroundReverse";
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
      <SvgBackgroundReversed />
      <NavBar1 />

      <NavBarTW />
      <SlantedDividerSolid color="#f1f5f9" height="81px" zIndex={ 2 } />
      <SlantedDivider
        topColor="#f1f5f9"
        bottomColor="#1D4ED8" // Tailwind's blue-700 color
        gradient="linear-gradient(135deg, #38bdf8, #1D4ED8)"
        height="49px"
        flip={ false } // Flip the slant if needed
        invert={ true } // Invert the angle if needed
        zIndex={ 1 } // Control stacking order
        overlap="-50px" // Control overlap between sections
      />



      <FeaturesGridWithIcons />


      <SlantedDividerSolid color="#f1f5f9" height="50px" flip invert zIndex={ 3 } />
      <SlantedDivider
        topColor="#2563eb"
        bottomColor="#2563eb" // Tailwind's blue-700 color
        gradient="linear-gradient(135deg, #2563eb, #2563eb)"
        height="50px"
        flip={ false } // Flip the slant if needed
        invert={ true } // Invert the angle if needed
        zIndex={ 1 } // Control stacking order
        overlap="-50px" // Control overlap between sections
      />





      <FooterFull />

    </>
  );
}
