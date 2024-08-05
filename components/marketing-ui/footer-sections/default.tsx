import { Footer } from "flowbite-react";

export function DefaultFooterSection() {
  return (
    <Footer className="rounded-none">
      <div className="mx-auto flex max-w-screen-xl flex-col items-center p-4 text-center md:p-8 lg:p-10 [&>div]:w-fit">
        <Footer.Brand
          alt="Eventjacket logo"
          href="https://eventjacket.com"
          name="EventJacket"
          src="/images/logo-full.png"
        />
        <p className="my-6 text-gray-500 dark:text-gray-400">
          EventJacket is a platform that helps you create and manage events with ease. We provide you with the tools you need to make your event a success.
        </p>
        <Footer.LinkGroup className="mb-6 flex flex-wrap items-center justify-center text-base text-gray-900 dark:text-white">
          <Footer.Link href="/about" className="mr-4 hover:underline md:mr-6 ">
            About
          </Footer.Link>
          
          <Footer.Link href="/blog" className="mr-4 hover:underline md:mr-6">
            Blog
          </Footer.Link>
          <Footer.Link href="/affiliate" className="mr-4 hover:underline md:mr-6">
            Affiliate Program
          </Footer.Link>
          <Footer.Link href="/faqs" className="mr-4 hover:underline md:mr-6">
            FAQs
          </Footer.Link>
          <Footer.Link href="/contact" className="mr-4 hover:underline md:mr-6">
            Contact
          </Footer.Link>
        </Footer.LinkGroup>
        <Footer.Copyright
          by="EventJacket™. All Rights Reserved."
          href="https://eventjacket.com"
          year={2024}
        />
      </div>
    </Footer>
  );
}
