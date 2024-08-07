import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';
import Image from 'next/image'; 
import Link from 'next/link';
import NavBar1 from '@/components/NavBarTW/NavBar1';
import FooterFull from '@/components/Footers/FooterFull';


// 1. Create a reader
const reader = createReader( process.cwd(), keystaticConfig );

export default async function Page ()
{

  // 2. Read the "Posts" collection
  const posts = await reader.collections.posts.all();
  return ( <>
    <NavBar1 /> 
    <div className="relative bg-gray-50 px-6 pb-20 pt-16 lg:px-8 lg:pb-28 lg:pt-24">
      <div className="absolute inset-0">
        <div className="h-1/3 bg-white sm:h-2/3" />
      </div>
      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Event Insights</h2>
          <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
            Stay updated with the latest trends, tips, and success stories from the world of event management and ticketing.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
          { posts.map( ( post ) => (
            <div key={ post.entry.title } className="flex flex-col overflow-hidden rounded-lg shadow-lg">
              <div className="flex-shrink-0">


                { post.entry.image && (
                  <Image
                    src={ post.entry.image }
                    alt={ post.entry.title }
                    width={ 200 }
                    height={ 200 }
                    className="h-48 w-full object-cover"
                  />
                ) }
              </div>
              <div className="flex flex-1 flex-col justify-between bg-white p-6">
                <div className="flex-1">
                  {<p className="text-sm font-medium text-blue-600">
                    <a href='/' className="hover:underline">
                     Post Catagory
                    </a>
                  </p>}
                  <a href={ `/posts/${ post.slug }` } className="mt-2 block">
                    <p className="text-xl font-semibold text-gray-900">{ post.entry.title }</p>
                    <p className="mt-3 text-base text-gray-500">{  }</p>
                  </a>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    
                      <span className="sr-only">Post author </span>
                      <img alt="" src='/images/logo.svg' className="h-10 w-10 " />
                  
                  </div>
                  <div className="ml-3">

                    <div className="flex space-x-1 text-sm text-gray-500">
                      <time >{ post.entry.datePosted }</time>
                      <span aria-hidden="true">&middot;</span>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) ) }
        </div>
      </div>
    </div>
    <FooterFull />  
  </>
  );
}