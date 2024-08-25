export default function HowItWorks ()
{
  return (
    <section className="py-10 sm:py-16 lg:py-24">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">How EventJacket Works</h2>
          <p className="max-w-lg mx-auto mt-4 text-base leading-relaxed text-gray-600">Effortlessly manage your events from start to finish with EventJacket. Here's a quick overview of how our platform can help you streamline event planning, ticket sales, and more.</p>
        </div>

        <div className="relative mt-12 lg:mt-20">
          <div className="absolute inset-x-0 hidden xl:px-44 top-2 md:block md:px-20 lg:px-28">
            <img className="w-full" src="https://cdn.rareblocks.xyz/collection/celebration/images/steps/2/curved-dotted-line.svg" alt="" />
          </div>

          <div className="relative grid grid-cols-1 text-center gap-y-12 md:grid-cols-3 gap-x-12">
            <div>
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
                <span className="text-xl font-semibold text-gray-700"> 1 </span>
              </div>
              <h3 className="mt-6 text-xl font-semibold leading-tight text-black md:mt-10">Sign Up and Set Up Your Profile</h3>
              <p className="mt-4 text-base text-gray-600">Create your free EventJacket account and set up your organization’s profile. Add essential details like your organization's name, logo, and contact information.</p>
            </div>

            <div>
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
                <span className="text-xl font-semibold text-gray-700"> 2 </span>
              </div>
              <h3 className="mt-6 text-xl font-semibold leading-tight text-black md:mt-10">Create and Manage Your Events</h3>
              <p className="mt-4 text-base text-gray-600">Use EventJacket's intuitive tools to create events, manage ticket sales, and coordinate volunteers, vendors, and performers. Customize your event pages with ease.</p>
            </div>

            <div>
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
                <span className="text-xl font-semibold text-gray-700"> 3 </span>
              </div>
              <h3 className="mt-6 text-xl font-semibold leading-tight text-black md:mt-10">Promote and Launch Your Event</h3>
              <p className="mt-4 text-base text-gray-600">Launch your event and start selling tickets. Use built-in marketing tools to promote your event across multiple channels and track performance with analytics.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
