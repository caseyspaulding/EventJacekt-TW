import FooterFull from '@/components/Footers/FooterFull';
import HeaderCentered from '@/components/HeaderCentered';
import NavBar1 from '@/components/NavBarTW/NavBar1';
import AnalyticsFeatures from './AnalyticsFeatures';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Analytics - EventJacket',
    description: 'Get a better understanding of where your event data.'
};

export default function AnalyticsPage() {
    return (
        <div>
            <NavBar1 />
            <HeaderCentered
                title="Analytics"
                description="Get a better understanding of where your event data."
            />

            <AnalyticsFeatures />
            <FooterFull />
        </div>
    );
}
