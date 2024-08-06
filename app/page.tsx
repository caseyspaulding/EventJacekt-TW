import CTACentered from "@/components/CTA/CTA-Centered";
import FeaturesGridWithIcons from "@/components/Features/FeaturesGridwithIcons";
import FooterFull from "@/components/Footers/FooterFull";
import NavBarTW from "@/components/NavBarTW/NavBarTW";

export default async function Index() {
  return (
    <>
      <NavBarTW />
      <FeaturesGridWithIcons />
      <CTACentered />
     <FooterFull />
    </>
  );
}
