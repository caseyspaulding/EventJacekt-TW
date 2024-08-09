'use client'; 

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import RichTextEditor from '@/components/RichTextEditor';
import { updateBlogPost } from '../../../../app/actions/blogActions';
import { createClient } from '@/utils/supabase/client';
import toast from 'react-hot-toast';
import { Button } from 'flowbite-react';

export default function EditPostPage ()
{
  const router = useRouter();
  const { id } = useParams();
  const [ title, setTitle ] = useState( '' );
  const [ content, setContent ] = useState( '' );
  const [ excerpt, setExcerpt ] = useState( '' );
  const [ author, setAuthor ] = useState( '' );
  const [ tags, setTags ] = useState( '' );
  const [ slug, setSlug ] = useState( '' );
  const [ loading, setLoading ] = useState( true );

  useEffect( () =>
  {
    const fetchPost = async () =>
    {
      const supabase = createClient();
      const { data: post, error } = await supabase
        .from( 'blog_posts' )
        .select( '*' )
        .eq( 'id', id )
        .single();

      if ( error )
      {
        toast.error( 'Error fetching post data' );
        router.push( '/admin/dashboard' );
        return;
      }

      if ( post )
      {
        setTitle( post.title );
        setContent( post.content );
        setExcerpt( post.excerpt );
        setAuthor( post.author );
        setTags( post.tags.join( ', ' ) );
        setSlug( post.slug );
        setLoading( false );
      }
    };

    fetchPost();
  }, [ id, router ] );

  const handleUpdate = async ( e: React.FormEvent ) =>
  {
    e.preventDefault();

    const formData = new FormData();
    formData.append( 'title', title );
    formData.append( 'content', content );
    formData.append( 'excerpt', excerpt );
    formData.append( 'author', author );
    formData.append( 'tags', tags );
    formData.append( 'slug', slug );

    const response = await updateBlogPost( id, formData );

    if ( response.success )
    {
      toast.success( 'Post updated successfully!' );
      router.push( '/admin/dashboard' );
    } else
    {
      toast.error( 'Error updating post' );
    }
  };

  if ( loading )
  {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Blog Post</h1>
      <form onSubmit={ handleUpdate } className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Post Title
          </label>
          <input
            name="title"
            type="text"
            value={ title }
            onChange={ ( e ) => setTitle( e.target.value ) }
            placeholder="Post Title"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            URL Slug
          </label>
          <input
            name="slug"
            type="text"
            value={ slug }
            onChange={ ( e ) => setSlug( e.target.value ) }
            placeholder="URL Slug"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Excerpt
          </label>
          <textarea
            name="excerpt"
            value={ excerpt }
            onChange={ ( e ) => setExcerpt( e.target.value ) }
            placeholder="Excerpt"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <RichTextEditor value={ content } onChange={ setContent } />
          <input type="hidden" name="content" value={ content } />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Author
          </label>
          <input
            name="author"
            type="text"
            value={ author }
            onChange={ ( e ) => setAuthor( e.target.value ) }
            placeholder="Author"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tags (comma-separated)
          </label>
          <input
            name="tags"
            type="text"
            value={ tags }
            onChange={ ( e ) => setTags( e.target.value ) }
            placeholder="Tags (comma-separated)"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
            Update Post
          </Button>
        </div>
      </form>
    </div>
  );
}
