import FooterFull from "@/components/Footers/FooterFull";
import Header from "@/components/Header";
import HeaderCentered from "@/components/HeaderCentered";
import NavBar1 from "@/components/NavBarTW/NavBar1";

export default function MarketingPage() {
  return (
    <div>
      <NavBar1 />
      <HeaderCentered title="Marketing" description="Get a better understanding of where your traffic is coming from." />
      Marketing Page
      <FooterFull />
    </div>
  )
}