import React from 'react';
import Link from 'next/link';
import { getAuthorBySlug, getPostsByAuthorId } from '@/app/actions/blogActions';


export default async function AuthorPage ( { params }: { params: { slug: string } } )
{
  const author = await getAuthorBySlug( params.slug );

  if ( !author )
  {
    return <div className="text-center text-xl text-red-600">Author not found</div>;
  }

  const posts = await getPostsByAuthorId( author.id );

  return (
    <>
      {/* Display author information */ }
      <h1 className="text-4xl font-bold mb-4">{ author.name }</h1>
      { author.bio && <p className="mb-6">{ author.bio }</p> }
      {/* List of posts by this author */ }
      <h2 className="text-2xl font-semibold mb-4">Posts by { author.name }</h2>
      { posts.length > 0 ? (
        <ul className="space-y-2">
          { posts.map( ( post ) => (
            <li key={ post.id }>
              <Link href={ `/blog/${ post.slug }` } className="text-blue-600 hover:underline">
                { post.title }
              </Link>
            </li>
          ) ) }
        </ul>
      ) : (
        <p>No posts found for this author.</p>
      ) }
    </>
  );
}
