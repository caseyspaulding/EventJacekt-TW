'use client';

import React, { useState } from 'react';
import RichTextEditor from './RichTextEditor';
import { Button } from 'flowbite-react';
import { createBlogPost } from '../app/actions/blogActions';
import toast from 'react-hot-toast';

const BlogPostForm: React.FC = () =>
{
  const [ title, setTitle ] = useState( '' );
  const [ content, setContent ] = useState( '' );
  const [ excerpt, setExcerpt ] = useState( '' );
  const [ author, setAuthor ] = useState( '' );
  const [ tags, setTags ] = useState( '' );
  const [ slug, setSlug ] = useState( '' );

  const handleSubmit = async ( e: React.FormEvent ) =>
  {
    e.preventDefault();

    // Create a FormData object
    const formData = new FormData();
    formData.append( 'title', title );
    formData.append( 'content', content );
    formData.append( 'excerpt', excerpt );
    formData.append( 'author', author );
    formData.append( 'tags', tags );
    formData.append( 'slug', slug );

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
    } else
    {
      // Show error toast notification
      toast.error( response.message );
    }
  };

  return (
    <form onSubmit={ handleSubmit }>
      <input
        name="title"
        type="text"
        value={ title }
        onChange={ ( e ) => setTitle( e.target.value ) }
        placeholder="Post Title"
        required
      />
      <input
        name="slug"
        type="text"
        value={ slug }
        onChange={ ( e ) => setSlug( e.target.value ) }
        placeholder="URL Slug"
      />
      <textarea
        name="excerpt"
        value={ excerpt }
        onChange={ ( e ) => setExcerpt( e.target.value ) }
        placeholder="Excerpt"
      />
      <RichTextEditor value={ content } onChange={ setContent } />
      <input type="hidden" name="content" value={ content } />
      <input
        name="author"
        type="text"
        value={ author }
        onChange={ ( e ) => setAuthor( e.target.value ) }
        placeholder="Author"
        required
      />
      <input
        name="tags"
        type="text"
        value={ tags }
        onChange={ ( e ) => setTags( e.target.value ) }
        placeholder="Tags (comma-separated)"
      />
      <Button type="submit">Create Post</Button>
    </form>
  );
};

export default BlogPostForm;
