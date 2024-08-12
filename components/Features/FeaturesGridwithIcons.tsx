import {
  CalendarIcon,
  ChartBarIcon,
  ClipboardIcon,
  CurrencyDollarIcon,
  TicketIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import SvgBackground from "../Backgrounds/SquareSvgBackground";
import SlantedDivider3 from "../Divider/SlantedDivider3";
import SlantedDividerSolid from "../Divider/SlantedDividerSolidProps";

const features = [
  {
    name: "Volunteer Management",
    description:
      "Easily manage and organize your volunteers, assign tasks, and track their contributions.",
    icon: UserGroupIcon,
  },
  {
    name: "Ticketing System",
    description:
      "Seamlessly handle ticket sales, manage attendees, and monitor event capacity.",
    icon: TicketIcon,
  },
  {
    name: "Analytics and Reporting",
    description:
      "Gain insights with real-time analytics and detailed reports on event performance.",
    icon: ChartBarIcon,
  },
  {
    name: "Event Scheduling",
    description:
      "Plan and schedule events with ease, keeping all your activities organized.",
    icon: CalendarIcon,
  },
  {
    name: "Task Management",
    description:
      "Create, assign, and track tasks to ensure everything runs smoothly during your event.",
    icon: ClipboardIcon,
  },
  {
    name: "Payment Processing",
    description:
      "Integrate with Stripe for secure and efficient payment processing.",
    icon: CurrencyDollarIcon,
  },
];

export default function FeaturesGridWithIcons() {
  return (
     <><div className="relative py-14 sm:py-22 lg:py-10 bg-slate-100">

      <div className="mx-auto max-w-md px-6 text-center sm:max-w-3xl lg:max-w-7xl lg:px-8">
        <h2 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-b from-blue-500 to-sky-500">
          EventJacket Features
        </h2>
        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Everything you need to manage your event
        </p>
        <p className="mx-auto mt-5 max-w-prose text-xl text-gray-500">
          EventJacket provides a comprehensive suite of tools to help you manage
          your events efficiently and effectively.
        </p>
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            
            { features.map( ( feature ) => (
              <div
                key={ feature.name }
                className="pt-6 transform transition-transform duration-300 hover:scale-105"
              >
                <div className="flow-root rounded-lg bg-slate-50  hover:bg-blue-100 px-6 pb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="-mt-6">
                    <span
                      className="inline-flex items-center justify-center rounded-xl p-3 shadow-lg"
                      style={ { background: 'linear-gradient(185deg, #1D4ED8, #38bdf8)' } }
                    >
                      <feature.icon aria-hidden="true" className="h-8 w-8 text-white" />
                    </span>
                    <h3 className="mt-8 text-lg font-semibold leading-8 tracking-tight text-gray-900">
                      { feature.name }
                    </h3>
                    <p className="mt-5 text-base leading-7 text-gray-600">
                      { feature.description }
                    </p>
                  </div>
                </div>
              </div>
            ) ) }

          </div>
        </div>
      </div>

    </div></>
  );
}
