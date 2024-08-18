import { NextResponse } from 'next/server';
import { db } from '@/db';
import { blogPosts } from '@/db/schema';

export async function POST(request: Request) {
    const { title, content, excerpt, author, tags, slug } = await request.json();
    const post = await db
        .insert(blogPosts)
        .values({
            title,
            content,
            excerpt,
            author,
            tags,
            slug
        })
        .returning();
    return NextResponse.json(post[0]);
}

export async function GET() {
    const posts = await db.select().from(blogPosts).orderBy(blogPosts.createdAt);
    return NextResponse.json(posts);
}
