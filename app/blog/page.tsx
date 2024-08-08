import React from 'react';
import Link from 'next/link';
import { db } from '@/db';
import { blogPosts } from '@/db/schema';
import NavBar1 from '@/components/NavBarTW/NavBar1';
import FooterFull from '@/components/Footers/FooterFull';

export default async function BlogList ()
{
  const posts = await db.select().from( blogPosts ).orderBy( blogPosts.createdAt );

  return (
    <><NavBar1 /><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Blog Posts</h1>
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        { posts.map( ( post ) => (
          <article key={ post.id } className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2">
                <Link href={ `/blog/${ post.slug }` }>
                  <p className="hover:underline text-blue-600">{ post.title }</p>
                </Link>
              </h2>
              <p className="text-gray-700 mb-4">{ post.excerpt }</p>
              <p className="text-sm text-gray-500">By { post.author } on { new Date( post.createdAt ).toLocaleDateString() }</p>
            </div>
          </article>
        ) ) }
      </div>
    </div><FooterFull />     </>
  );
}
