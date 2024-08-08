// components/BlogPostForm.tsx
'use client'; 
import React, { useState } from 'react';
import RichTextEditor from './RichTextEditor';
import { Button } from 'flowbite-react';

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
    // Submit to API (adjust the endpoint as needed)
    const response = await fetch( '/api/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( {
        title,
        content,
        excerpt,
        author,
        tags: tags.split( ',' ).map( tag => tag.trim() ),
        slug
      } ),
    } );
    // Handle response
  };

  return (
    <form onSubmit={ handleSubmit }>
      <input
        type="text"
        value={ title }
        onChange={ ( e ) => setTitle( e.target.value ) }
        placeholder="Post Title"
      />
      <input
        type="text"
        value={ slug }
        onChange={ ( e ) => setSlug( e.target.value ) }
        placeholder="URL Slug"
      />
      <textarea
        value={ excerpt }
        onChange={ ( e ) => setExcerpt( e.target.value ) }
        placeholder="Excerpt"
      />
      <RichTextEditor value={ content } onChange={ setContent } />
      <input
        type="text"
        value={ author }
        onChange={ ( e ) => setAuthor( e.target.value ) }
        placeholder="Author"
      />
      <input
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