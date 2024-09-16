'use client';

import React, { useEffect, useState } from 'react';
import RichTextEditor from './RichTextEditor';
import { createBlogPost } from '../app/actions/blogActions';
import { createClient } from '@/utils/supabase/client';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { Button } from '@nextui-org/button';

const BlogPostForm: React.FC = () =>
{
  const router = useRouter();
  const supabase = createClient();
  const [ user, setUser ] = useState<User | null>( null );
  const [ title, setTitle ] = useState( '' );
  const [ content, setContent ] = useState( '' );
  const [ excerpt, setExcerpt ] = useState( '' );
  const [ author, setAuthor ] = useState( '' );
  const [ tags, setTags ] = useState( '' );
  const [ slug, setSlug ] = useState( '' );
  const [ metaTitle, setMetaTitle ] = useState( '' );
  const [ metaDescription, setMetaDescription ] = useState( '' );
  const [ isPublished, setIsPublished ] = useState( false );
  const [ featuredImage, setFeaturedImage ] = useState<File | null>( null );
  const [ postImage, setPostImage ] = useState<File | null>( null ); // State for blog post image

  useEffect( () =>
  {
    const checkUser = async () =>
    {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if ( user?.email !== 'casey.spaulding@gmail.com' )
      {
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

    const fileName = `${ Date.now() }-${ file.name }`;

    const { data, error } = await supabase
      .storage
      .from( 'blogimages' )
      .upload( `public/${ fileName }`, file, {
        cacheControl: '3600',
        upsert: false,
      } );

    if ( error )
    {
      console.error( 'Error uploading file:', error.message );
      return null;
    }

    const { publicUrl } = supabase.storage
      .from( 'blogimages' )
      .getPublicUrl( `public/${ fileName }` )
      .data;

    return publicUrl || '';
  };

  // Handle uploading the blog post image and inserting it into the Quill editor
  const handleBlogPostImageUpload = async () =>
  {
    if ( !postImage )
    {
      toast.error( 'Please select an image to upload.' );
      return;
    }

    const imageUrl = await handleImageUpload( postImage );
    if ( !imageUrl )
    {
      toast.error( 'Failed to upload the image.' );
      return;
    }

    // Insert the image URL into the Quill editor
    const quill = document.querySelector( '.ql-editor' ) as HTMLElement;
    if ( quill )
    {
      quill.innerHTML += `<img src="${ imageUrl }" alt="Uploaded Image" />`;
      setPostImage( null ); // Clear the selected image
      toast.success( 'Image uploaded and inserted into the content.' );
    }
  };

  const handleSubmit = async ( e: React.FormEvent ) =>
  {
    e.preventDefault();

    if ( !featuredImage )
    {
      toast.error( 'Please select a featured image.' );
      return;
    }

    const imageUrl = await handleImageUpload( featuredImage );
    if ( !imageUrl )
    {
      toast.error( 'Failed to upload the image.' );
      return;
    }

    const formData = new FormData();
    formData.append( 'title', title );
    formData.append( 'content', content );
    formData.append( 'excerpt', excerpt );
    formData.append( 'author', author );
    formData.append( 'tags', tags );
    formData.append( 'slug', slug );
    formData.append( 'metaTitle', metaTitle );
    formData.append( 'metaDescription', metaDescription );
    formData.append( 'isPublished', isPublished.toString() );
    formData.append( 'featuredImage', imageUrl );

    const response = await createBlogPost( formData );

    if ( response.success )
    {
      toast.success( response.message );
      setTitle( '' );
      setContent( '' );
      setExcerpt( '' );
      setAuthor( '' );
      setTags( '' );
      setSlug( '' );
      setMetaTitle( '' );
      setMetaDescription( '' );
      setIsPublished( false );
      setFeaturedImage( null );
    } else
    {
      toast.error( response.message );
    }
  };

  if ( !user )
  {
    return <div>Loading...</div>;
  }


  return (
    <div className=" bg-gray-100 rounded-2xl p-5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 p-5 py-12 bg-white rounded-2xl">
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

          {/* New Blog Post Image Input */ }
          <div>
            <label className="block text-sm font-medium text-gray-700">Blog Post Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={ ( e ) => setPostImage( e.target.files?.[ 0 ] || null ) }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <Button onClick={ handleBlogPostImageUpload } className="mt-2 bg-blue-600 text-white">
              Upload and Insert Image
            </Button>
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
          {/* New Fields */ }
          <div>
            <label className="block text-sm font-medium text-gray-700">Meta Title</label>
            <input
              name="metaTitle"
              type="text"
              value={ metaTitle }
              onChange={ ( e ) => setMetaTitle( e.target.value ) }
              placeholder="Meta Title"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Meta Description</label>
            <textarea
              name="metaDescription"
              value={ metaDescription }
              onChange={ ( e ) => setMetaDescription( e.target.value ) }
              placeholder="Meta Description"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>


          <div className="flex items-center">
            <input
              name="isPublished"
              type="checkbox"
              checked={ isPublished }
              onChange={ ( e ) => setIsPublished( e.target.checked ) }
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Publish</label>
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
    </div>
  );
};

export default BlogPostForm;
