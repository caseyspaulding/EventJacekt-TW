'use client'


const timeline = [
  {
    name: 'Founded Company',
    description:
      'EventJacket was born out of a passion for simplifying event management. ',
    date: 'Aug 2024',
    dateTime: '2024-08',
  },
  {
    name: 'Launched MVP',
    description:
      'Launched our Minimum Viable Product (MVP) to start helping event organizers streamline their operations.',
    date: 'Sep 2024',
    dateTime: '2024-10',
  },
  {
    name: 'Onboarded First Customer',
    description:
      'First customer, who believed in our vision and provided invaluable feedback to shape our product.',
    date: 'Oct 2024',
    dateTime: '2024-11',
  },
  {
    name: 'Released Version 1.0',
    description:
      'With feedback from our early users, we refined our platform and launched Version 1.0, packed with features to enhance the event planning experience.',
    date: 'Nov 2025',
    dateTime: '2025-03',
  },

];


const stats = [
  { label: 'Events supported so far', value: '3' },
  { label: 'Happy organizers', value: '100%' },
  { label: 'New features added monthly', value: '5' },
];

const values = [
  {
    name: 'Sell tickets seamlessly and affordably',
    description:
      'Strive for excellence in everything you do. Whether it’s the smallest detail or the biggest challenge, we aim to set the standard and exceed expectations.',
  },
  {
    name: 'Manage vendors, sponsors, volunteers, and performers in one place',
    description:
      'Knowledge is power, and we believe in spreading that power around. By sharing what we know, we help each other grow and achieve more together.',
  },
  {
    name: 'Track sales and analytics in real time',
    description:
      'The world is always changing, and so are we. We embrace every opportunity to learn something new, pushing ourselves to grow and adapt.',
  },
  {
    name: 'Use role-based permissions to organize your team',
    description:
      'We’re all in this together. Whether it’s a teammate, a customer, or a partner, we lift each other up and celebrate each other’s successes.',
  },
  {
    name: 'Streamline your event with features like QR code ticket scanning',
    description:
      'We own our actions and their outcomes. When something needs to be done, we step up and see it through, with integrity and accountability.',
  },
 
];

const team = [
  {
    name: 'Casey Spaulding',
    role: 'Founder',
    imageUrl: '/images/avatars/caseyProfilePic.jpg',
    websiteUrl: 'https://www.caseyspaulding.com',
  },
  {
    name: 'Laura Spaulding',
    role: 'Co-Founder',
    imageUrl: '/images/avatars/laura.jpg',
    websiteUrl: 'https://www.facebook.com/laura.spaulding.5',
  },
  {
    name: 'Whidbey Ren Faire',
    role: 'Advisor',
    imageUrl: '/images/avatars/wrf.jpg',
    websiteUrl: 'https://whidbeyislandrenfaire.org'
  },


  // More people...
]



export default function AboutHeroBig ()
{


  return (
    <div className="bg-white mb-10">


      <main className="isolate">
        {/* Hero section */ }
        <div className="relative isolate -z-10">
          <svg
            aria-hidden="true"
            className="absolute inset-x-0 top-0 -z-10 h-[69rem] w-full stroke-gray-200 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]"
          >
            <defs>
              <pattern
                x="50%"
                y={ -1 }
                id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
                width={ 200 }
                height={ 200 }
                patternUnits="userSpaceOnUse"
              >
                <path d="M.5 200V.5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y={ -1 } className="overflow-visible fill-gray-50">
              <path
                d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                strokeWidth={ 0 }
              />
            </svg>
            <rect fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)" width="100%" height="100%" strokeWidth={ 0 } />
          </svg>
          <div
            aria-hidden="true"
            className="absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
          >
            <div
              style={ {
                clipPath:
                  'polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)',
              } }
              className="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-[#0053df] to-[#8dc4ff] opacity-30"
            />
          </div>
          <div className="overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 pb-32 pt-35 sm:pt-60 lg:px-8 lg:pt-1">
              <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                <div className="w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
                  <h1 className="text-4xl font-bold tracking-tight text-blue-700 sm:text-6xl">
                    About EventJacket
                  </h1>
                  <p className="relative mt-6 text-lg leading-8 text-gray-600 sm:max-w-md lg:max-w-none">
                    EventJacket was born out of a personal mission to simplify event management, especially for nonprofits and community-driven organizations. As a software developer, I’ve always been passionate about solving real-world problems with technology. The spark for EventJacket came when I was helping a close friend who ran a Renaissance fair. She was also a Navy veteran, and I saw firsthand the struggles she faced managing her events using several disjointed tools.
                  </p>
                  <br /> 
                  <p>
                    That experience made me realize how cumbersome and expensive it was for small organizations to juggle multiple platforms for ticket sales, vendor coordination, volunteer management, and more. I knew there had to be a better way—a more efficient, affordable solution that would bring all of these features under one roof. And so, EventJacket was born.
                </p>
                </div>
                <div className="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
                  <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                    <div className="relative">
                      <img
                        alt=""
                        src="https://images.unsplash.com/photo-1485217988980-11786ced9454?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80"
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                  <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                    <div className="relative">
                      <img
                        alt=""
                        src="/images/avatars/caseyandlaura.jpg"
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                    <div className="relative">
                      <img
                        alt=""
                        src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-x=.4&w=396&h=528&q=80"
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                  <div className="w-44 flex-none space-y-8 pt-32 sm:pt-0">
                    <div className="relative">
                      <img
                        alt=""
                        src="https://images.unsplash.com/photo-1670272504528-790c24957dda?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=left&w=400&h=528&q=80"
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                    <div className="relative">
                      <img
                        alt=""
                        src="/images/festival-4.png"
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

       
        {/* Content section */ }
        <div className="mx-auto -mt-12 max-w-7xl px-6 sm:mt-4 lg:px-8 xl:-mt-10">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our mission</h2>
            <div className="mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row">
              <div className="lg:w-full lg:max-w-2xl lg:flex-auto">
                <p className="text-xl leading-8 text-gray-600">
                  At EventJacket, we're on a mission to give event organizers the tools they need to plan like a pro, wow their attendees, and make every event a hit!
                </p>
                <div className="mt-10 max-w-xl text-base leading-7 text-gray-700">
                  <p>
                    We believe great events can inspire, connect, and make magic happen. That’s why we’ve crafted a platform that takes care of all the tricky stuff, so organizers can focus on what really counts: creating unforgettable moments.
                  </p>
                  <p className="mt-10">
                    Our mission is to simplify event planning and elevate the experience for everyone involved. With EventJacket, you can streamline your operations, engage your audience, and let your creativity shine—without getting bogged down by the details.
                  </p>
                  <p className="mt-10">
                    We’re committed to continuously improving our platform, making sure it evolves with your needs. Whether you’re planning a small meetup or a large conference, we’re here to help you make it extraordinary.
                  </p>
                </div>
              </div>
              <div className="lg:flex lg:flex-auto lg:justify-center">
                <dl className="w-64 space-y-8 xl:w-80">
                  { stats.map( ( stat ) => (
                    <div key={ stat.label } className="flex flex-col-reverse gap-y-4">
                      <dt className="text-base leading-7 text-gray-600">{ stat.label }</dt>
                      <dd className="text-5xl font-semibold tracking-tight text-gray-900">{ stat.value }</dd>
                    </div>
                  ) ) }
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Image section */ }
        <div className="mt-32 sm:mt-40 xl:mx-auto xl:max-w-7xl xl:px-8">
          <img
            alt=""
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80"
            className="aspect-[5/2] w-full object-cover xl:rounded-3xl"
          />
        </div>

        {/* Values section */ }
        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Commitment</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We are committed to making event management more accessible, particularly for nonprofits and community organizations. We know budgets can be tight, so we designed EventJacket to be affordable without compromising on the features you need:
            </p>
          </div>
          <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            { values.map( ( value ) => (
              <div key={ value.name }>
                <dt className="font-semibold text-gray-900">{ value.name }</dt>
                <dd className="mt-1 text-gray-600">{ value.description }</dd>
              </div>
            ) ) }
          </dl>
        </div>

        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">What Makes Us Different</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            EventJacket was created with people like my Navy friend in mind—those who are dedicated to organizing incredible events but find themselves juggling multiple platforms that don't quite fit. Our platform is all about simplicity and affordability, designed to help you do more with less.
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Instead of paying for several tools, EventJacket consolidates everything into one, saving you time and money. Our tool grows with your event, whether it’s your first small gathering or your biggest festival yet.
          </p>

          <h2 className="text-3xl mt-6 font-bold tracking-tight text-gray-900 sm:text-4xl">Our Inspiration</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            The inspiration for EventJacket comes from real-world challenges that I witnessed while helping my friend manage her Renaissance fair. Watching her navigate multiple tools—each with its own complexity and cost—made me realize that event organizers deserve a single solution that works for them, not against them.
          </p>

          <h2 className="text-3xl mt-6 font-bold tracking-tight text-gray-900 sm:text-4xl">Looking Ahead</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            EventJacket continues to grow and adapt to the evolving needs of event organizers. We’re constantly working to add new features, improve the user experience, and keep our platform affordable for all. Our goal is to make sure that you can focus on what matters most—creating memorable experiences for your attendees—while we handle the logistics.
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Whether you’re managing a small community event or a large-scale festival, EventJacket is here to support you with a reliable, all-in-one platform.
          </p>
        </div>

        {/* Team section */ }
        <div className="mx-auto mt-12 max-w-7xl px-6 sm:mt-48 lg:px-8 mb-11">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Meet Our Team</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We’re a small but mighty team dedicated to bringing your events to life. Each of us brings unique skills and a shared passion for making event planning a breeze.
            </p>
          </div>
          <ul
            role="list"
            className="mx-auto mt-20 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-16 text-center sm:grid-cols-3 md:grid-cols-4 lg:mx-0 lg:max-w-none lg:grid-cols-5 xl:grid-cols-6"
          >
            { team.map( ( person ) => (
              <li key={ person.name }>
                <img alt="" src={ person.imageUrl } className="mx-auto h-24 w-24 rounded-full" />
                <h3 className="mt-6 text-base font-semibold leading-7 tracking-tight text-gray-900">
                  <a href={ person.websiteUrl } target="_blank" rel="noopener noreferrer">
                    { person.name }
                  </a>
                </h3>
                <p className="text-sm leading-6 text-gray-600">{ person.role }</p>
              </li>
            ) ) }
          </ul>
        </div>

        {/* Blog section */ }

      </main>

      {/* Footer */ }
      {/* Timeline section */ }
      {/*<div className="mx-auto -mt-8 max-w-7xl px-6 lg:px-8 mb-12">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 overflow-hidden lg:mx-0 lg:max-w-none lg:grid-cols-4">
          { timeline.map( ( item ) => (
            <div key={ item.name }>
              <time
                dateTime={ item.dateTime }
                className="flex items-center text-sm font-semibold leading-6 text-blue-600"
              >
                <svg viewBox="0 0 4 4" aria-hidden="true" className="mr-4 h-1 w-1 flex-none">
                  <circle r={ 2 } cx={ 2 } cy={ 2 } fill="currentColor" />
                </svg>
                { item.date }
                <div
                  aria-hidden="true"
                  className="absolute -ml-2 h-px w-screen -translate-x-full bg-gray-900/10 sm:-ml-4 lg:static lg:-mr-6 lg:ml-8 lg:w-auto lg:flex-auto lg:translate-x-0"
                />
              </time>
              <p className="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900">{ item.name }</p>
              <p className="mt-1 text-base leading-7 text-gray-600">{ item.description }</p>
            </div>
          ) ) }
        </div>
      </div>
      <div className='py-10'>

      </div>*/}
    </div>
  )
}
