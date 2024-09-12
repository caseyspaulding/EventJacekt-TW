import FooterFull from "@/components/Footers/FooterFull";
import NavBar1 from "@/components/NavBarTW/NavBar1";

export default function HelpCenter ()
{
  return (<>
    <NavBar1 /> 
    <div className="max-w-screen-md mx-auto py-10 px-5">
      <h1 className="text-3xl font-bold text-center mb-8">Welcome to the EventJacket Help Center</h1>

      {/* Introduction Section */ }
      <p className="text-lg text-gray-700 text-center mb-8">
        Need help? You've come to the right place! Explore our resources below or reach out to our support team for assistance.
      </p>

      {/* FAQ Section */ }
      <section>
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div>
          <h3 className="text-lg font-semibold mb-2">How do I create an event?</h3>
          <p className="mb-4">Creating an event is simple. Navigate to your dashboard and click on 'Create Event' to get started.</p>

          

          {/* Add more FAQs */ }
        </div>
      </section>

      {/* Getting Started Guide */ }
      <section>
        <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
        <p className="mb-4">
          Follow these simple steps to get started with EventJacket:
        </p>
        <ol className="list-decimal list-inside mb-8">
          <li>Sign up for an account</li>
          <li>Create your first event</li>
          <li>Manage ticket sales and attendees</li>
          <li>Track event performance with analytics</li>
        </ol>
      </section>

      {/* Contact Support */ }
      <section>
        <h2 className="text-2xl font-semibold mb-4">Need Further Assistance?</h2>
        <p className="mb-4">If you can't find what you're looking for, feel free to contact our support team:</p>
        <ul className="list-disc list-inside">
          <li>Email: support@eventjacket.com</li>
          <li>Live Chat: Available during business hours</li>
          <li>Call us:  +1 (407) 326-3692</li>
        </ul>
      
      </section>
    </div>
    <FooterFull />  
  </>
  );
}
