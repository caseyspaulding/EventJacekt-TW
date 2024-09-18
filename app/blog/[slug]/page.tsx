import React from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { getBlogPostBySlug, getAllBlogSlugs } from '@/app/actions/blogActions';
import FooterFull from '@/components/Footers/FooterFull';
import NavBar1 from '@/components/NavBarTW/NavBar1';
import type { Metadata } from 'next';

// This function generates all static paths for the blog post pages
export async function generateStaticParams ()
{
    const slugs = await getAllBlogSlugs();
    return slugs.map( ( slug: string ) => ( { slug } ) );
}

// Function to generate dynamic metadata
export async function generateMetadata ( { params }: { params: { slug: string }; } ): Promise<Metadata>
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
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt || post.content.slice( 0, 160 ),
        openGraph: {
            images: post.featuredImage ? [ post.featuredImage ] : []
        }
    };
}

// Function to calculate the read time
function calculateReadTime ( content: string ): string
{
    const wordsPerMinute = 200; // Average reading speed
    const wordCount = content.split( ' ' ).length;
    const minutes = Math.ceil( wordCount / wordsPerMinute );
    return `${ minutes } min read`;
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
    const readTime = calculateReadTime( post.content );

    return (
        <>
            <NavBar1 />
            <div className="">
                <article className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-2">
                   {/* Header Section */ }
                    <div className="relative mb-8 flex flex-col md:flex-row items-center md:items-stretch">
                        {/* Left Column: Title, Author, Date, and Read Time */ }
                        
                        <div className="md:w-2/3 flex flex-col justify-center p-2 bg-white rounded-tl-xl rounded-bl-xl ">
                            <p className="text-sm text-gray-500 mb-6">
                               { post.tags ? post.tags.join( ', ' ) : '' }
                            </p>
                            <h1 className="text-4xl font-bold text-gray-800 mb-4">{ post.title }</h1>
                            <p className="text-sm text-gray-500 mb-4">
                                { new Date( post.createdAt ).toLocaleDateString() } • { readTime }
                            </p>
                            <p className="text-sm text-gray-500">
                                By { post.author }
                            </p>
                            
                        </div>
                       

                        {/* Right Column: Featured Image */ }
                        { post.featuredImage && (
                            <div className="w-full md:w-3/4 h-96 overflow-hidden">
                                <img
                                    src={ post.featuredImage }
                                    alt={ post.title }
                                    className="w-full h-full object-cover rounded-xl md:rounded-tl-xl" // Rounded on mobile, not on medium and larger
                                />
                            </div>
                        ) }
                    </div>

                    {/* Content and Sidebar Container */ }
                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 bg-white rounded-2xl p-2">
                        {/* Main Content */ }
                        <div className="xl:col-span-3">
                            <div
                                className="prose prose-lg max-w-none"
                                dangerouslySetInnerHTML={ { __html: sanitizedContent } }
                            />
                            
                        </div>

                        {/* Sticky Aside */ }
                        <aside className="hidden xl:block xl:col-span-1 space-y-6 xl:space-y-10">
                            <div className="sticky top-20 space-y-6">
                                {/* Small Ad */ }
                                <div className="p-6 bg-blue-100 rounded-lg shadow-md text-center">
                                    <h3 className="text-lg font-bold text-blue-900 mb-2">Create an Account for Free!</h3>
                                    <p className="text-sm text-gray-700 mb-4">
                                        Join now and get access to exclusive content, updates, and more.
                                    </p>
                                    <a
                                        href="/signup"
                                        className="inline-block px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                    >
                                        Sign Up Now
                                    </a>
                                </div>
                            </div>
                        </aside>
                    </div>
                </article>

                <FooterFull />
            </div>
        </>
    );
}
