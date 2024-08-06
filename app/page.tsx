
import NavBar1 from "@/components/NavBarTW/NavBar1";
import CTAwPicture from "@components/CTA/CTAwPicture";
import FeaturesGridWithIcons from "@components/Features/FeaturesGridwithIcons";
import FooterFull from "@components/Footers/FooterFull";
import NavBarTW from "@components/NavBarTW/NavBarTW";

export default async function Index() {
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
