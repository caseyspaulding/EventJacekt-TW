import { Badge, Banner } from "flowbite-react";
import { HiX } from "react-icons/hi";

export function AnnouncementBanner ()
{
  return (
    <Banner>
      <div className="flex w-full items-center justify-between border border-gray-200 bg-gray-50 px-2 py-3 dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto flex items-center gap-x-3">
          <Badge className="hidden bg-yellow-300 text-zinc-900 w-fit md:inline">
            🚧 Under Construction 🚧
          </Badge>
          <p className="text-sm font-medium text-gray-900 dark:text-white md:my-0">
            🚧 We’re still working on things here, so please pardon the dust.🚧
            <span className="ml-2 inline-flex items-center text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">
              Thanks for stopping by!
            </span>
          </p>
        </div>

        <Banner.CollapseButton
          color="gray"
          className="border-0 bg-transparent px-0 text-gray-400 enabled:hover:bg-gray-200 enabled:hover:text-gray-900 dark:enabled:hover:bg-gray-600 dark:enabled:hover:text-white [&>span]:px-2"
        >
          <HiX className="h-5 w-5" />
        </Banner.CollapseButton>
      </div>
    </Banner>
  );
}
