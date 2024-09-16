import React from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { getBlogPostBySlug, getAllBlogSlugs } from '@/app/actions/blogActions';
import FooterFull from '@/components/Footers/FooterFull';
import NavBar1 from '@/components/NavBarTW/NavBar1';
import type { Metadata } from 'next';

// This function generates all static paths for the blog post pages
export async function generateStaticParams() {
    const slugs = await getAllBlogSlugs();
    return slugs.map((slug: string) => ({ slug }));
}

// Function to generate dynamic metadata
export async function generateMetadata ( {
    params
}: {
    params: { slug: string };
} ): Promise<Metadata>
{
    const post = await getBlogPostBySlug( params.slug );

    if ( !post )
    {
        return {
            title: 'Post not found',
            description: 'The post you are looking for does not exist.'
        };
    }

    return {
        title: post.metaTitle || post.title, // Use `metaTitle` if available
        description: post.metaDescription || post.excerpt || post.content.slice( 0, 160 ), // Use `metaDescription` if available
        openGraph: {
            images: post.featuredImage ? [ post.featuredImage ] : []
        }
    };
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
        <>
            <NavBar1 />
            <div className='bg-gray-100'>
            <article className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                {/* Featured Image */ }
                { post.featuredImage && (
                    <div className="mb-8 w-full rounded-2xl overflow-hidden">
                        <img
                            src={ post.featuredImage }
                            alt={ post.title }
                            className="w-full h-auto object-cover md:aspect-[2240/750] aspect-[2240/750]"
                        />
                    </div>
                ) }

                {/* Content and Sidebar Container */ }
      
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 bg-white rounded-2xl p-4 ">
                    {/* Main Content */ }
                    <div className="xl:col-span-3">
                        <h1 className="mb-4 text-4xl font-bold text-gray-800">{ post.title }</h1>
                        <p className="mb-8 text-sm text-gray-500">
                            By { post.author } on { new Date( post.createdAt ).toLocaleDateString() }
                        </p>
                        <div
                            className="prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={ { __html: sanitizedContent } }
                        />
                        <div className="mt-8">
                            <p className="text-sm text-gray-500">
                                Tags: { post.tags ? post.tags.join( ', ' ) : 'No tags' }
                            </p>
                        </div>
                    </div>

                        {/* Sticky Aside */ }
                        <aside className="hidden xl:block xl:col-span-1 space-y-6 xl:space-y-10">
                            <div className="sticky top-20 space-y-6">
                                {/* Small Ad */ }
                                <div className="p-6 bg-blue-100 rounded-lg shadow-md text-center">
                                    <h3 className="text-lg font-bold text-blue-900 mb-2">Create an Account for Free!</h3>
                                    <p className="text-sm text-gray-700 mb-4">Join now and get access to exclusive content, updates, and more.</p>
                                    <a
                                        href="/signup" // Replace this with your signup page URL
                                        className="inline-block px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                    >
                                        Sign Up Now
                                    </a>
                                </div>

                                {/* Your existing aside content */ }
                                <div>
                                    
                                </div>
                            </div>
                        </aside>
                </div>
            </article>
        
            <FooterFull />
        </div >
        </>
    );
}