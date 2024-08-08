import React from 'react';
import Link from 'next/link';
import { db } from '@/db';
import { blogPosts } from '@/db/schema';

export default async function BlogList ()
{
  const posts = await db.select().from( blogPosts ).orderBy( blogPosts.createdAt  );

  return (
    <div>
      { posts.map( ( post ) => (
        <article key={ post.id }>
          <h2><Link href={ `/blog/${ post.slug }` }>{ post.title }</Link></h2>
          <p>{ post.excerpt }</p>
          <p>By { post.author } on { new Date( post.createdAt ).toLocaleDateString() }</p>
        </article>
      ) ) }
    </div>
  );
}
