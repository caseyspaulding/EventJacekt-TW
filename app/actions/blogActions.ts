// app/actions/blogActions.ts
'use server'

import { db } from '@/db';
import { blogPosts } from '@/db/schema';
import { eq } from 'drizzle-orm';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getBlogPostBySlug ( slug: string )
{
  try
  {
    // Decode the slug and replace %20 with hyphens
    const decodedSlug = decodeURIComponent( slug ).replace( /%20/g, '-' );
    console.log( 'Fetching blog post with processed slug:', decodedSlug );

    const [ post ] = await db.select().from( blogPosts ).where( eq( blogPosts.slug, decodedSlug ) );
    console.log( 'Fetched post:', post );
    return post;
  } catch ( error )
  {
    console.error( 'Error fetching blog post:', error );
    return null;
  }
}

export async function createBlogPost ( formData: FormData )
{
  const title = formData.get( 'title' ) as string;
  const content = formData.get( 'content' ) as string;
  const excerpt = formData.get( 'excerpt' ) as string || '';
  const author = formData.get( 'author' ) as string;
  const tags = ( formData.get( 'tags' ) as string ).split( ',' ).map( tag => tag.trim() );
  let slug = formData.get( 'slug' ) as string;

  if ( !slug )
  {
    slug = generateSlug( title );
  }

  try
  {
    const existingPosts = await db.select().from( blogPosts ).where( eq( blogPosts.slug, slug ) );
    if ( existingPosts.length > 0 )
    {
      return { success: false, message: 'A post with this slug already exists.' };
    }

    await db.insert( blogPosts ).values( {
      title,
      content,
      excerpt,
      author,
      tags,
      slug,
      createdAt: new Date(),
      updatedAt: new Date(),
    } );

    revalidatePath( '/blog' );

    return { success: true, message: 'Post created successfully!' };

  } catch ( error )
  {
    console.error( 'Error inserting blog post:', error );
    return { success: false, message: 'Failed to create blog post. Please try again.' };
  }
}
export async function getAllBlogSlugs ()
{
  // Assuming you're using Supabase with Drizzle ORM
  const slugs = await db.select( { slug: blogPosts.slug } ).from( blogPosts );
  return slugs.map( post => post.slug );
}
// Helper function to generate a slug from a title
function generateSlug ( title: string ): string
{
  return title
    .toLowerCase()
    .trim()
    .replace( /[^\w\s-]/g, '' ) // Remove invalid characters
    .replace( /\s+/g, '-' )      // Replace spaces with hyphens
    .replace( /--+/g, '-' )      // Replace multiple hyphens with a single hyphen
    .substring( 0, 255 );        // Limit slug length to 255 characters
}