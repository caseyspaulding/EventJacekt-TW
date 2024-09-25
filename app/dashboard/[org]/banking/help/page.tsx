'use client';

export default function BankingHelpPage ()
{
  return (
    <div className="bg-white p-8 rounded-2xl  ">
      <h1 className="text-4xl font-bold mb-6">How to Set Up Your Payments on EventJacket</h1>
      <p className="text-lg text-gray-700 mb-6">
        EventJacket makes it easy for you to collect payments from ticket sales, donations, and more. Follow the steps below to get set up and start receiving funds in your account.
      </p>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Connect Your Bank Account</h2>
        <p className="text-gray-600">
          To receive money from ticket sales or donations, you’ll need to securely connect your bank account. This allows EventJacket to transfer the funds directly to you.
        </p>
        <ul className="list-disc list-inside mt-4 text-gray-600">
          <li>Go to your <strong>Banking Settings</strong> in the dashboard.</li>
          <li>Click <strong>Connect Bank Account</strong>.</li>
          <li>Fill in the required information, such as your bank account number and routing number.</li>
          <li>Once completed, your bank account will be securely linked.</li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Start Selling Tickets and Collecting Donations</h2>
        <p className="text-gray-600">
          With your bank account connected, you’re ready to start earning. When you sell tickets or receive donations, the funds will automatically be routed to your account.
        </p>
        <ul className="list-disc list-inside mt-4 text-gray-600">
          <li>Set up your event pages and create tickets for attendees.</li>
          <li>Customers can purchase tickets or make donations using EventJacket’s secure checkout.</li>
          <li>All payments are processed securely and automatically transferred to your connected bank account.</li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Track Your Sales and Earnings</h2>
        <p className="text-gray-600">
          EventJacket provides real-time updates on your ticket sales, donations, and transfers. You can monitor your earnings directly in the dashboard.
        </p>
        <ul className="list-disc list-inside mt-4 text-gray-600">
          <li>Visit the <strong>Sales Dashboard</strong> to view all ticket sales and donations.</li>
          <li>Track how much you’ve earned, and see details for each transaction.</li>
          <li>Check the status of upcoming payments and transfers to your bank account.</li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Receive Your Money</h2>
        <p className="text-gray-600">
          Once your event ends or at regular intervals, your funds will be automatically transferred to your bank account. You don’t need to do anything – EventJacket handles everything for you.
        </p>
        <ul className="list-disc list-inside mt-4 text-gray-600">
          <li>Transfers typically take 1-2 business days to appear in your account.</li>
          <li>Track all transfers in the <strong>Banking Section</strong> of your dashboard.</li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Need Help?</h2>
        <p className="text-gray-600">
          If you have any questions or need assistance with your payments, feel free to reach out to our support team. We’re here to help!
        </p>
        <ul className="list-disc list-inside mt-4 text-gray-600">
          <li>Visit the <strong>Help Center</strong> in your dashboard for FAQs and guides.</li>
          <li>Contact our support team via email or chat for additional assistance.</li>
          <li>Call Us: +1 (407) 326-3692</li>
          <li>Email Us: team@eventjacket.com </li>

        </ul>
      </div>


    </div>
  );
}
