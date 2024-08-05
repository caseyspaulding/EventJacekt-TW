import CTACentered from "@/components/CTA/CTA-Centered";
import FeaturesGridWithIcons from "@/components/Features/FeaturesGridwithIcons";
import FooterTW from "@/components/Footers/FooterTW";
import NavBarTW from "@/components/NavBarTW/NavBarTW";

export default async function Index() {
  return (
    <>
      <div className="bg-white ">
        <NavBarTW />
        <FeaturesGridWithIcons />
        <CTACentered />
        <FooterTW />
      </div>
    </>
  );
}
