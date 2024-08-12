

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

      <FeaturesGridWithIcons />

      <CTAwPicture />
      <FooterFull />

    </>
  );
}
