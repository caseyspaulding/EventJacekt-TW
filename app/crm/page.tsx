


import FooterFull from "@/components/Footers/FooterFull";
import HeaderCentered from "@/components/HeaderCentered";
import NavBar1 from "@/components/NavBarTW/NavBar1";
import CRMFeatures from "./CRMFeatures";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'CRM - EventJacket',
  description: 'Managing your vendors, performers and attendees has never been easier. Keep track of all your interactions and make sure you never miss a beat.',
};
export default function CRM() {
  return (
    <div>
      <NavBar1 />  
      <HeaderCentered
        title="CRM"
        description="Managing your vendors, performers and attendees has never been easier. Keep track of all your interactions and make sure you never miss a beat."
      />
      <CRMFeatures />
      <FooterFull /></div>
  )
}