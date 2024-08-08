import React from 'react';
import ReactMarkdown from 'react-markdown';
import { db } from '@/db';
import { blogPosts } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function BlogPost ( { params }: { params: { slug: string } } )
{
  const [ post ] = await db.select().from( blogPosts ).where( eq( blogPosts.slug, params.slug ) );

  if ( !post )
  {
    return <div>Post not found</div>;
  }

  return (
    <article>
      <h1>{ post.title }</h1>
      <ReactMarkdown>{ post.content }</ReactMarkdown>
      <p>By { post.author } on { new Date( post.createdAt ).toLocaleDateString() }</p>
      <div>
        Tags: { post.tags ? post.tags.join( ', ' ) : '' }
      </div>
    </article>
  );
}