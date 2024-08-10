import FooterFull from "@/components/Footers/FooterFull";
import HeaderCentered from "@/components/HeaderCentered";
import NavBar1 from "@/components/NavBarTW/NavBar1";
import { Footer } from "flowbite-react";

export default function Guides ()
{
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar1 /> 
      <HeaderCentered title="Guides" description="Here you will find a collection of helpful articles and tutorials to assist you with using EventJacket. Whether you’re just getting started or looking to master advanced features, we’ve got you covered." />

      <main className="flex-grow">
        <section className="mx-auto max-w-4xl p-6">
          

          {/* Placeholder for guide list or content */ }
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">Getting Started with EventJacket</h2>
              <p className="text-gray-700">A comprehensive guide to help you set up and start using EventJacket.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">Advanced Ticketing Features</h2>
              <p className="text-gray-700">Learn about the advanced ticketing options available in EventJacket.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">Customizing Your Event Page</h2>
              <p className="text-gray-700">Step-by-step instructions to personalize your event page to match your brand.</p>
            </div>
          </div>
        </section>
      </main>

      <FooterFull />
    </div>
  );
}
