import React from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { getBlogPostBySlug, getAllBlogSlugs } from '@/app/actions/blogActions';
import { Footer } from 'flowbite-react';
import FooterFull from '@/components/Footers/FooterFull';
import NavBar1 from '@/components/NavBarTW/NavBar1';

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
    return <div className="text-center text-xl text-red-600">Post not found</div>;
  }

  // Sanitize the HTML content
  const sanitizedContent = DOMPurify.sanitize( post.content );

  return (
    <><NavBar1 /><article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">{ post.title }</h1>
      <p className="text-sm text-gray-500 mb-8">
        By { post.author } on { new Date( post.createdAt ).toLocaleDateString() }
      </p>
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={ { __html: sanitizedContent } } />
      <div className="mt-8">
        <p className="text-sm text-gray-500">Tags: { post.tags ? post.tags.join( ', ' ) : 'No tags' }</p>
      </div>
    </article><FooterFull /></>
  );
}
