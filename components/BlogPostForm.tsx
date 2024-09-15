'use client';

import React, { useEffect, useState } from 'react';
import RichTextEditor from './RichTextEditor';

import { createBlogPost } from '../app/actions/blogActions';
import { createClient } from '@/utils/supabase/client';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js'; // Import the User type
import { Button } from '@nextui-org/button';

const BlogPostForm: React.FC = () =>
{
  const router = useRouter();
  const supabase = createClient();
  const [ user, setUser ] = useState<User | null>( null ); // Allow both User and null types
  const [ title, setTitle ] = useState( '' );
  const [ content, setContent ] = useState( '' );
  const [ excerpt, setExcerpt ] = useState( '' );
  const [ author, setAuthor ] = useState( '' );
  const [ tags, setTags ] = useState( '' );
  const [ slug, setSlug ] = useState( '' );
  const [ featuredImage, setFeaturedImage ] = useState<File | null>( null );
  useEffect( () =>
  {
    const checkUser = async () =>
    {
      const supabase = createClient();
      const {
        data: { user }
      } = await supabase.auth.getUser();

      // Authorization check
      if ( user?.email !== 'casey.spaulding@gmail.com' )
      { // Replace with your email
        toast.error( 'You do not have access to this page.' );
        router.push( '/' );
        return;
      }

      setUser( user );
    };

    checkUser();
  }, [ router, supabase ] );


 


  const handleImageUpload = async ( file: File | null ) =>
  {
    if ( !file )
    {
      console.error( 'No file selected' );
      return null;
    }

    const { error } = await createClient().storage
      .from( 'blogimages' ) // Replace with your bucket name
      .upload( `public/${ file.name }`, file, {
        cacheControl: '3600',
        upsert: false,
      } );

    if ( error )
    {
      console.error( 'Error uploading file:', error.message );
      return null;
    }

    const { data: publicUrlData } = createClient().storage
      .from( 'blogimages' )
      .getPublicUrl( `public/${ file.name }` );

    return publicUrlData?.publicUrl || '';
  };


  const handleSubmit = async ( e: React.FormEvent ) =>
  {
    e.preventDefault();

    // Check if a file is selected
    if ( !featuredImage )
    {
      toast.error( 'Please select a featured image.' );
      return;
    }

    // Proceed with uploading the image and creating the blog post
    const imageUrl = await handleImageUpload( featuredImage );
    if ( !imageUrl )
    {
      toast.error( 'Failed to upload the image.' );
      return;
    }

    // Create a FormData object
    const formData = new FormData();
    formData.append( 'title', title );
    formData.append( 'content', content );
    formData.append( 'excerpt', excerpt );
    formData.append( 'author', author );
    formData.append( 'tags', tags );
    formData.append( 'slug', slug );
    formData.append( 'featuredImage', imageUrl ); // Include the image URL

    const response = await createBlogPost( formData );

    if ( response.success )
    {
      // Show success toast notification
      toast.success( response.message );

      // Clear the form after successful submission
      setTitle( '' );
      setContent( '' );
      setExcerpt( '' );
      setAuthor( '' );
      setTags( '' );
      setSlug( '' );
      setFeaturedImage( null );
    } else
    {
      // Show error toast notification
      toast.error( response.message );
    }
  };

  if ( !user )
  {
    return <div>Loading...</div>; // Show a loading state while checking user
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Create New Blog Post</h1>
      <form onSubmit={ handleSubmit } className="space-y-6">
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
            Featured Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={ ( e ) => setFeaturedImage( e.target.files?.[ 0 ] || null ) }
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
            Create Post
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BlogPostForm;
