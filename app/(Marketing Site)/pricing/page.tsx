
import
  {
    ArrowPathIcon,
    Bars3Icon,
    BookmarkSquareIcon,
    CalendarIcon,
    ChartBarIcon,
    CheckIcon,
    CursorArrowRaysIcon,
    LifebuoyIcon,
    PhoneIcon,
    PlayIcon,
    ShieldCheckIcon,
    Squares2X2Icon,
    XMarkIcon,
  } from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import NavBar1 from '@/components/NavBarTW/NavBar1'

const solutions = [
  {
    name: 'Analytics',
    description: 'Get a better understanding of where your traffic is coming from.',
    href: '#',
    icon: ChartBarIcon,
  },
  {
    name: 'Engagement',
    description: 'Speak directly to your customers in a more meaningful way.',
    href: '#',
    icon: CursorArrowRaysIcon,
  },
  { name: 'Security', description: "Your customers' data will be safe and secure.", href: '#', icon: ShieldCheckIcon },
  {
    name: 'Integrations',
    description: "Connect with third-party tools that you're already using.",
    href: '#',
    icon: Squares2X2Icon,
  },
  {
    name: 'Automations',
    description: 'Build strategic funnels that will drive your customers to convert',
    href: '#',
    icon: ArrowPathIcon,
  },
]
const callsToAction = [
  { name: 'Watch Demo', href: '#', icon: PlayIcon },
  { name: 'Contact Sales', href: '#', icon: PhoneIcon },
]
const resources = [
  {
    name: 'Help Center',
    description: 'Get all of your questions answered in our forums or contact support.',
    href: '#',
    icon: LifebuoyIcon,
  },
  {
    name: 'Guides',
    description: 'Learn how to maximize our platform to get the most out of it.',
    href: '#',
    icon: BookmarkSquareIcon,
  },
  {
    name: 'Events',
    description: 'See what meet-ups and other events we might be planning near you.',
    href: '#',
    icon: CalendarIcon,
  },
  { name: 'Security', description: 'Understand how we take your privacy seriously.', href: '#', icon: ShieldCheckIcon },
]
const recentPosts = [
  { id: 1, name: 'Boost your conversion rate', href: '#' },
  { id: 2, name: 'How to use search engine optimization to drive traffic to your site', href: '#' },
  { id: 3, name: 'Improve your customer experience', href: '#' },
]
const features = [
  'Vitae in pulvinar odio id utobortis in inter.',
  'Sed sed id viverra viverra augue eget massa.',
  'Urna, gravida amet, a, integer venenatis.',
  'Lobortis sed pharetra amet vitae eleifend.',
  'Ullamcorper blandit a consequat donec elit aoreet.',
  'Dolor quo assumenda.',
  'Esse rerum distinctio maiores maiores.',
  'Eos enim officiis ratione.',
  'Tempore molestiae aliquid excepturi.',
  'Perspiciatis eveniet inventore eum et aliquam.',
]
const faqs = [
  {
    id: 1,
    question: "What's the best thing about Switzerland?",
    answer:
      "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
  },
  {
    id: 2,
    question: 'Why do you never see elephants hiding in trees?',
    answer:
      "Because they're so good at it. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
  },
  {
    id: 3,
    question: 'How do you make holy water?',
    answer:
      'You boil the hell out of it. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.',
  },
  {
    id: 4,
    question: "Why can't you hear a pterodactyl go to the bathroom?",
    answer:
      'Because the pee is silent. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.',
  },
  {
    id: 5,
    question: 'What do you call someone with no body and no nose?',
    answer: 'Nobody knows. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.',
  },
  {
    id: 6,
    question: 'Why did the invisible man turn down the job offer?',
    answer:
      "He couldn't see himself doing it. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
  },
]


function classNames ( ...classes: string[] )
{
  return classes.filter( Boolean ).join( ' ' )
}

export default function Example ()
{
  return (

    <div className="bg-white">
     <NavBar1 />  

      <div className="bg-gradient-to-b from-blue-50 via-white to-white">
        {/* Pricing section with single price and feature list */ }
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
          <div className="pb-16 xl:flex xl:items-center xl:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                <span className="text-gray-900">Everything you need for</span>
                <span className="text-blue-600">$19 a month</span>
              </h1>
              <p className="mt-5 text-xl text-gray-500">
                Includes every feature we offer plus unlimited projects and unlimited users.
              </p>
            </div>
            <a
              href="#"
              className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-5 py-3 text-base font-medium text-white hover:bg-blue-700 sm:mt-10 sm:w-auto xl:mt-0"
            >
              Get started today
            </a>
          </div>
          <div className="border-t border-gray-200 pt-16 xl:grid xl:grid-cols-3 xl:gap-x-8">
            <div>
              <h2 className="text-lg font-semibold text-blue-600">Everything you need</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">All-in-one platform</p>
              <p className="mt-4 text-lg text-gray-500">
                
              </p>
            </div>
            <div className="mt-4 sm:mt-8 md:mt-10 md:grid md:grid-cols-2 md:gap-x-8 xl:col-span-2 xl:mt-0">
              <ul role="list" className="divide-y divide-gray-200">
                { features.slice( 0, 5 ).map( ( feature, featureIdx ) => (
                  <li key={ feature } className={ classNames( featureIdx === 0 ? 'md:py-0 md:pb-4' : '', 'flex py-4' ) }>
                    <CheckIcon aria-hidden="true" className="h-6 w-6 flex-shrink-0 text-green-500" />
                    <span className="ml-3 text-base text-gray-500">{ feature }</span>
                  </li>
                ) ) }
              </ul>
              <ul role="list" className="divide-y divide-gray-200 border-t border-gray-200 md:border-t-0">
                { features.slice( 5 ).map( ( feature, featureIdx ) => (
                  <li
                    key={ feature }
                    className={ classNames( featureIdx === 0 ? 'md:border-t-0 md:py-0 md:pb-4' : '', 'flex py-4' ) }
                  >
                    <CheckIcon aria-hidden="true" className="h-6 w-6 flex-shrink-0 text-green-500" />
                    <span className="ml-3 text-base text-gray-500">{ feature }</span>
                  </li>
                ) ) }
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Branded FAQ 
      <div className="bg-blue-900">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white">Frequently asked questions</h2>
          <div className="mt-6 border-t border-blue-400 border-opacity-25 pt-10">
            <dl className="space-y-10 md:grid md:grid-cols-2 md:grid-rows-2 md:gap-x-8 md:gap-y-12 md:space-y-0">
              { faqs.map( ( item ) => (
                <div key={ item.id }>
                  <dt className="text-lg font-medium leading-6 text-white">{ item.question }</dt>
                  <dd className="mt-2 text-base text-blue-200">{ item.answer }</dd>
                </div>
              ) ) }
            </dl>
          </div>
        </div>
      </div>
*/ }
      {/* CTA section */ }
      <div className="bg-blue-50">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:flex lg:items-center lg:justify-between lg:px-8 lg:py-24">
          <h2 className="text-3xl font-bold tracking-tight text-blue-900 sm:text-4xl">
            <span className="block">Ready to dive in?</span>
            <span className="block text-blue-600">Start your free trial today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-5 py-3 text-base font-medium text-white hover:bg-blue-700"
              >
                Get started
              </a>
            </div>
          </div>
        </div>
      </div>

     
    </div>
  )
}
