
import CTAwPicture from "@/components/CTA/CTAwPicture";
import FeaturesGridWithIcons from "@/components/Features/FeaturesGridwithIcons";
import FooterFull from "@/components/Footers/FooterFull";
import NavBarTW from "@/components/NavBarTW/NavBarTW";

export default async function Index() {
  return (
    <>
      <NavBarTW />
      <FeaturesGridWithIcons />
      
      <CTAwPicture /> 
     <FooterFull />
    </>
  );
}
