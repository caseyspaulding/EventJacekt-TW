import TabsComponent from '@/components/TabsComponent';



const tabsData = [
  {
    value: 'emails',
    label: 'Emails',
    content: (
      <div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <h2 className="text-3xl font-bold">Send personalized emails, texts, videos, and more</h2>
            <p className="text-xl">Engage your community like never before. This is donor stewardship, done right.</p>

          </div>
          <div className="flex-1">
            <img
              src="/placeholder.svg?height=400&width=400"
              alt="Image"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    ),
  },
  {
    value: 'texts',
    label: 'Texts',
    content: <p>Content for text messaging will go here.</p>,
  },
  {
    value: 'mailings',
    label: 'Mailings',
    content: <p>Content for mailings will go here.</p>,
  },
  {
    value: 'settings',
    label: 'Settings',
    content: <p>Engage settings and configurations will go here.</p>,
  },
];

export default function MyApp ()
{
  return (
    <TabsComponent
      title="Connect"
      description="Connect with your audience with branded and customized content."
      tabsData={ tabsData }
    />
  );
}