import React from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { getBlogPostBySlug, getAllBlogSlugs } from '@/app/actions/blogActions';

// This function generates all static paths for the blog post pages
export async function generateStaticParams ()
{
  const slugs = await getAllBlogSlugs();
  return slugs.map( ( slug: string ) => ( { slug } ) );
}

export default async function BlogPost ( { params }: { params: { slug: string } } )
{
  const post = await getBlogPostBySlug( params.slug );

  if ( !post )
  {
    return <div>Post not found</div>;
  }

  // Sanitize the HTML content
  const sanitizedContent = DOMPurify.sanitize( post.content );

  return (
    <article>
      <h1>{ post.title }</h1>
      <div dangerouslySetInnerHTML={ { __html: sanitizedContent } } />
      <p>By { post.author } on { new Date( post.createdAt ).toLocaleDateString() }</p>
      <div>
        Tags: { post.tags ? post.tags.join( ', ' ) : '' }
      </div>
    </article>
  );
}
