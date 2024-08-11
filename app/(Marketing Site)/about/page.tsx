import AboutHeroBig from "@/components/About/AboutHeroBig"
import FooterFull from "@/components/Footers/FooterFull"
import NavBar1 from "@/components/NavBarTW/NavBar1"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'About Us - EventJacket',
  description: 'Learn more about EventJacket and our mission to simplify event management.',
};

const timeline = [
  {
    name: 'Founded EventJacket',
    description: 'EventJacket was born from a vision to simplify event management',
    date: 'Aug 2023',
    dateTime: '2023-08',
  },
  {
    name: 'Beta Launch',
    description: 'Opened EventJacket to beta testers, gathering valuable feedback',
    date: 'Jan 2024',
    dateTime: '2024-01',
  },
  {
    name: 'Feature Expansion',
    description: 'Added advanced ticketing and analytics features',
    date: 'Mar 2024',
    dateTime: '2024-03',
  },
  {
    name: 'Official Launch',
    description: 'EventJacket goes live to the public',
    date: 'Jun 2024',
    dateTime: '2024-06',
  },
]

export default function About ()
{
  return (
    <><NavBar1 />
    <AboutHeroBig />
    <FooterFull />    
    </>
  )
}