'use client';

import { useState } from 'react';
import AboutTab from './AboutTab';
import AccountTab from './AccountTab';
import IntegrationsTab from './IntegrationsTab';
import UsersTab from './UsersTab';
import ImportsTab from './ImportsTab';

// Define SubTab types
type AboutSubTab =
  | 'Organization Profile'
  | 'Addresses'
  | 'Branding'
  | 'Landing Page'
  | 'Account Verification'
  | 'Subscription & Billing';

type AccountSubTab = 'Profile' | 'Security' | 'Notifications';

type SubTab = AboutSubTab | AccountSubTab;

// Define MainTab type
type MainTab = 'About' | 'Account' | 'Integrations' | 'Users' | 'Imports';

export default function SettingsPage() {
  const mainTabs: MainTab[] = ['About', 'Account', 'Integrations', 'Users', 'Imports'];

  const subTabs: Record<MainTab, SubTab[]> = {
    About: [
      'Organization Profile',
      'Addresses',
      'Branding',
      'Landing Page',
      'Account Verification',
      'Subscription & Billing',
    ],
    Account: ['Profile', 'Security', 'Notifications'],
    Integrations: [],
    Users: [],
    Imports: [],
    // Add sub-tabs for other main tabs if necessary
  };

  const [activeMainTab, setActiveMainTab] = useState<MainTab>('About');
  const [activeSubTab, setActiveSubTab] = useState<SubTab>(subTabs['About'][0]);

  const renderMainContent = () => {
    switch (activeMainTab) {
      case 'About':
        return (
          <AboutTab
            //@ts-ignore
            activeSubTab={activeSubTab as AboutSubTab}
            setActiveSubTab={setActiveSubTab}
            subTabs={subTabs[activeMainTab] as AboutSubTab[]}
          />
        );
      case 'Account':
        return (
          <AccountTab
            activeSubTab={ activeSubTab as AccountSubTab }
            //@ts-ignore
            setActiveSubTab={setActiveSubTab}
            subTabs={subTabs[activeMainTab] as AccountSubTab[]}
          />
        );
      case 'Integrations':
        return <IntegrationsTab />;
      case 'Users':
        return <UsersTab />;
      case 'Imports':
        return <ImportsTab />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {/* Main navigation */}
      <nav className="flex space-x-6 mb-6">
        {mainTabs.map((tab) => (
          <button
            key={tab}
            className={`pb-2 ${
              activeMainTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                : 'text-gray-500'
            }`}
            onClick={() => {
              setActiveMainTab(tab);
              const firstSubTab = subTabs[tab][0];
              setActiveSubTab(firstSubTab);
            }}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Main content with conditional sidebar */}
      {subTabs[activeMainTab] && subTabs[activeMainTab].length > 0 ? (
        <div className="flex gap-6">
          {/* Sidebar navigation */}
          <nav className="w-64 bg-gray-50 p-4 rounded-lg">
            {subTabs[activeMainTab].map((tab) => (
              <button
                key={tab}
                className={`block w-full text-left py-2 px-3 rounded ${
                  activeSubTab === tab
                    ? 'bg-blue-100 text-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveSubTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* Main content */}
          <div className="flex-1 bg-white p-6 rounded-lg border">{renderMainContent()}</div>
        </div>
      ) : (
        // If no sub-tabs, render only main content
        <div className="bg-white p-6 rounded-lg border">{renderMainContent()}</div>
      )}
    </div>
  );
}
