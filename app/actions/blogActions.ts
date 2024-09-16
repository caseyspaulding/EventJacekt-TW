// app/actions/blogActions.ts
'use server';

import { db } from '@/db';
import { blogPosts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createClient } from '../../utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getBlogPostBySlug(slug: string) {
    try {
        // Decode the slug and replace %20 with hyphens
        const decodedSlug = decodeURIComponent(slug).replace(/%20/g, '-');
        console.log('Fetching blog post with processed slug:', decodedSlug);

        const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, decodedSlug));
        console.log('Fetched post:', post);
        return post;
    } catch (error) {
        console.error('Error fetching blog post:', error);
        return null;
    }
}

export async function getAllBlogPosts() {
    try {
        const posts = await db.select().from(blogPosts).then(); // Execute the query and get the results
        return { success: true, data: posts };
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return { success: false, data: [] };
    }
}

export async function createBlogPost(formData: FormData) {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const excerpt = (formData.get('excerpt') as string) || '';
    const author = formData.get('author') as string;
    const tags = (formData.get('tags') as string).split(',').map((tag) => tag.trim());
    let slug = formData.get('slug') as string;
    const featuredImage = formData.get('featuredImage') as string; // Get the featured image URL

    if (!slug) {
        slug = generateSlug(title);
    }

    try {
        // Check if the post with the same slug already exists
        const existingPosts = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
        if (existingPosts.length > 0) {
            return { success: false, message: 'A post with this slug already exists.' };
        }

        // Insert the new blog post into the database
        await db.insert(blogPosts).values({
            title,
            content,
            excerpt,
            author,
            tags,
            slug,
            featuredImage, // Include the featured image URL
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Revalidate the blog path to update the page
        revalidatePath('/blog');

        return { success: true, message: 'Post created successfully!' };
    } catch (error) {
        console.error('Error inserting blog post:', error);
        return { success: false, message: 'Failed to create blog post. Please try again.' };
    }
}

export async function getAllBlogSlugs() {
    // Assuming you're using Supabase with Drizzle ORM
    const slugs = await db.select({ slug: blogPosts.slug }).from(blogPosts);
    return slugs.map((post) => post.slug);
}
// Helper function to generate a slug from a title
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove invalid characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/--+/g, '-') // Replace multiple hyphens with a single hyphen
        .substring(0, 255); // Limit slug length to 255 characters
}

export async function updateBlogPost ( id: string, formData: FormData )
{
    const supabase = createClient();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, error } = await supabase
        .from( 'blog_posts' )
        .update( {
            title: formData.get( 'title' ),
            content: formData.get( 'content' ),
            excerpt: formData.get( 'excerpt' ),
            author: formData.get( 'author' ),
            tags: formData
                .get( 'tags' )
                ?.toString()
                .split( ',' )
                .map( ( tag ) => tag.trim() ),
            slug: formData.get( 'slug' ),
            meta_title: formData.get( 'metaTitle' ),
            meta_description: formData.get( 'metaDescription' ),
            is_published: formData.get( 'isPublished' ) === 'true',
            featured_image: formData.get( 'featuredImage' ),
            updated_at: new Date().toISOString(),
        } )
        .eq( 'id', id );

    if ( error )
    {
        return { success: false, message: 'Failed to update the blog post' };
    }

    return { success: true, message: 'Blog post updated successfully' };
}


export async function deletePost(postId: number) {
    const supabase = createClient();
    const { error } = await supabase.from('blog_posts').delete().eq('id', postId);

    if (error) {
        console.error('Error deleting post:', error.message);
        return { success: false, error: error.message };
    }

    return { success: true };
}
