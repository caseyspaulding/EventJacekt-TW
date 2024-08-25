const faqs = [
  {
    id: 1,
    question: "What types of events can I manage with EventJacket?",
    answer:
      "EventJacket is versatile and can handle a wide range of events, including conferences, workshops, concerts, weddings, and corporate gatherings. Our platform is designed to accommodate both small intimate events and large-scale productions.",
  },
  {
    id: 2,
    question: 'How does EventJacket handle ticket sales and payments?',
    answer:
      "EventJacket integrates with Stripe to process ticket sales securely. You can set up various ticket types, pricing tiers, and even offer promotional codes. Funds are typically transferred to your linked bank account daily or weekly, depending on your preferences.",
  },
  {
    id: 3,
    question: 'Can I customize the registration form for my event?',
    answer:
      'Yes, EventJacket allows you to create custom registration forms. You can add fields to collect specific information from attendees, such as dietary requirements, session preferences, or any other details relevant to your event.',
  },
  {
    id: 4,
    question: "How does the check-in process work with EventJacket?",
    answer:
      'EventJacket provides a streamlined check-in process using QR codes. Attendees receive a unique QR code with their ticket, which can be scanned using our mobile app or a compatible device at the event entrance for quick and efficient check-in.',
  },
  {
    id: 5,
    question: 'What kind of reports and analytics does EventJacket offer?',
    answer: 'EventJacket provides comprehensive reporting features, including real-time ticket sales data, attendance tracking, revenue summaries, and attendee demographics. You can also generate custom reports to gain insights specific to your event needs.',
  },
  {
    id: 6,
    question: 'Is it possible to manage multiple events simultaneously on EventJacket?',
    answer:
      "Yes, EventJacket is designed to handle multiple events concurrently. You can create, manage, and track numerous events from a single dashboard, making it ideal for event planners, organizations, or venues that host various events.",
  },
]

export default function FAQ_TW ()
{
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">Frequently asked questions</h2>
          <p className="mt-6 text-base leading-7 text-gray-600">
            Have a different question and can't find the answer you're looking for? Reach out to our support team by{ ' ' }
            <a href="mailto:team@eventjacket.com" className="font-semibold text-blue-700 hover:text-blue-400">
              sending us an email
            </a>{ ' ' }
            and we'll get back to you as soon as we can.
          </p>
        </div>
        <div className="mt-20">
          <dl className="space-y-16 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-16 sm:space-y-0 lg:gap-x-10">
            { faqs.map( ( faq ) => (
              <div key={ faq.id }>
                <dt className="text-base font-semibold leading-7 text-gray-900">{ faq.question }</dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">{ faq.answer }</dd>
              </div>
            ) ) }
          </dl>
        </div>
      </div>
    </div>
  )
}
