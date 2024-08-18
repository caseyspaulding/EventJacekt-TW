import FooterFull from '@/components/Footers/FooterFull';
import HeaderCentered from '@/components/HeaderCentered';
import NavBar1 from '@/components/NavBarTW/NavBar1';
import MarketingFeatures from './MarketingFeatures';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Marketing Events - EventJacket',
    description: 'Get the word out about your event.'
};

export default function MarketingPage() {
    return (
        <div>
            <NavBar1 />
            <HeaderCentered
                title="Marketing Events"
                description="Get the word out about your event."
            />
            <MarketingFeatures />
            <FooterFull />
        </div>
    );
}
