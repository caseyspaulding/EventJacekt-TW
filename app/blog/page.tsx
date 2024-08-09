import React from 'react';
import Link from 'next/link';
import { db } from '@/db';
import { blogPosts } from '@/db/schema';
import NavBar1 from '@/components/NavBarTW/NavBar1';
import FooterFull from '@/components/Footers/FooterFull';
import HeaderCentered from '@/components/HeaderCentered';

export default async function BlogList ()
{
  const posts = await db.select().from( blogPosts ).orderBy( blogPosts.createdAt );

  return (
    <>
      <NavBar1 />
      <HeaderCentered
        title="Blog"
        description=" Read the latest articles from our blog for tips to grow and organize stellar events with EventJacket."
      />
      <div className="bg-white ">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
          
            
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            { posts.map( ( post ) => (
              <article key={ post.id } className="flex flex-col items-start justify-between">
                <div className="relative w-full">
                  <img
                    alt=""
                    src='/images/blog/image-1.jpg'
                    //  src={ post.imageUrl }
                    className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                </div>
                <div className="max-w-xl">
                  <div className="mt-8 flex items-center gap-x-4 text-xs">
                    <p className="text-sm text-gray-500">By { post.author } on { new Date( post.createdAt ).toLocaleDateString() }</p>

                  </div>
                  <div className="group relative">
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                      <Link href={ `/blog/${ post.slug }` }>
                        <span className="absolute inset-0" />
                        { post.title }
                      </Link>
                    </h3>
                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{ post.excerpt }</p>
                  </div>
                  <div className="relative mt-8 flex items-center gap-x-4">
                    {/*<img alt="Author" src={ post.author } className="h-10 w-10 rounded-full bg-gray-100" />*/ }
                    <div className="text-sm leading-6">
                      <p className="font-semibold text-gray-900">

                      </p>
                      {/*<p className="text-gray-600">{ post.author }</p>*/ }
                    </div>
                  </div>
                </div>
              </article>
            ) ) }
          </div>
        </div>
      </div>



      <FooterFull />     </>
  );
}
