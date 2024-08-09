'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updatePost, deletePost } from '../app/actions/blogActions'; // Ensure this path is correct
import { Post } from '../types/Post'; // Ensure you have the Post type in your types folder

interface EditPostProps
{
  post: Post;
}

export default function EditPost ( { post }: EditPostProps )
{
  const router = useRouter();
  const [ title, setTitle ] = useState( post.title );
  const [ content, setContent ] = useState( post.content );
  const [ errorMessage, setErrorMessage ] = useState<string>( '' );

  const handleUpdate = async ( e: React.FormEvent ) =>
  {
    e.preventDefault();
    try
    {
      const result = await updatePost( post.id, { title, content } );

      if ( result.success )
      {
        router.push( '/blog' ); // Redirect to the blog list page after updating
      } else
      {
        setErrorMessage( result.error || 'Failed to update the post.' );
      }
    } catch ( error )
    {
      setErrorMessage( 'An error occurred while updating the post.' );
    }
  };

  const handleDelete = async () =>
  {
    try
    {
      const result = await deletePost( post.id );

      if ( result.success )
      {
        router.push( '/blog' ); // Redirect to the blog list page after deleting
      } else
      {
        setErrorMessage( result.error || 'Failed to delete the post.' );
      }
    } catch ( error )
    {
      setErrorMessage( 'An error occurred while deleting the post.' );
    }
  };

  return (
    <div>
      <h1>Edit Post</h1>
      { errorMessage && <p style={ { color: 'red' } }>{ errorMessage }</p> }
      <form onSubmit={ handleUpdate }>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={ title }
            onChange={ ( e ) => setTitle( e.target.value ) }
            required
          />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={ content }
            onChange={ ( e ) => setContent( e.target.value ) }
            required
          />
        </div>
        <button type="submit">Update Post</button>
      </form>
      <button onClick={ handleDelete } style={ { color: 'red', marginTop: '10px' } }>
        Delete Post
      </button>
    </div>
  );
}
