// app/dashboard/[org]/ClientDashboard.tsx
'use client';

import { DashboardSidebar } from './sidebar';
import EventActions from './EventActions';

interface ClientDashboardProps {
    orgName: string;
    dashboardData: {
        id: string;
        organizationId: string;
        organizationName: string;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    events: any[]; // Replace 'any' with your actual event type
}

export default function ClientDashboard({ orgName, dashboardData, events }: ClientDashboardProps) {
    return (
        <div className="flex">
            <DashboardSidebar />
            <div className="container mx-auto px-4 ">
                <h1 className="mb-6 text-3xl font-bold">Dashboard for {orgName}</h1>
                <p className="mb-4 text-xl">Welcome to {dashboardData.organizationName}</p>

                {/* Organization Info Section */}
                <section className="mb-6 rounded-lg bg-white p-6 shadow">
                    <h2 className="mb-4 text-2xl font-semibold">Organization Info</h2>
                    <p>
                        <strong>ID:</strong> {dashboardData.id}
                    </p>
                    <p>
                        <strong>Organization ID:</strong> {dashboardData.organizationId}
                    </p>
                </section>

                {/* Events Section */}
                <EventActions events={events} />
            </div>
        </div>
    );
}
