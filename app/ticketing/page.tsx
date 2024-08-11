import FooterFull from "@/components/Footers/FooterFull";
import HeaderCentered from "@/components/HeaderCentered";
import NavBar1 from "@/components/NavBarTW/NavBar1";
import TicketingFeatures from "./TicketingFeatures";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Ticketing - EventJacket',
  description: 'From seamless ticket creation, effortless sales tracking, our platform empowers you to manage attendees and ticket sales with just a few clicks.',
};

export default function page ()
{
  return (
    <div>
      <NavBar1 />
      <HeaderCentered
        title="Ticketing Solutions"
        description="From seamless ticket creation, effortless sales tracking, our platform empowers you to manage attendees and ticket sales with just a few clicks."
      />
      <TicketingFeatures /> 
      <FooterFull />
    </div>
  )
}