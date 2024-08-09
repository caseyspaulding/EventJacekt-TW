'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { Button, Modal } from 'flowbite-react';

type BlogPost = {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  tags: string[];
};

const AdminDashboard = () =>
{
  const [ posts, setPosts ] = useState<BlogPost[]>( [] );
  const [ user, setUser ] = useState<User | null>( null );
  const [ showModal, setShowModal ] = useState( false );
  const [ postToDelete, setPostToDelete ] = useState<BlogPost | null>( null );
  const router = useRouter();

  useEffect( () =>
  {
    const checkUser = async () =>
    {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if ( user?.email !== 'casey.spaulding@outlook.com' )
      {
        router.push( '/login' ); // redirect to login if not admin
        return;
      }

      setUser( user );

      const { data: posts } = await supabase.from( 'blog_posts' ).select( '*' );
      setPosts( posts || [] );
    };

    checkUser();
  }, [ router ] );

  const handleDelete = async () =>
  {
    if ( postToDelete )
    {
      const supabase = createClient();
      const { error } = await supabase
        .from( 'blog_posts' )
        .delete()
        .eq( 'id', postToDelete.id );

      if ( error )
      {
        console.error( 'Error deleting post:', error );
        // Optionally show an error message
      } else
      {
        setPosts( posts.filter( post => post.id !== postToDelete.id ) );
        setShowModal( false );
        setPostToDelete( null );
      }
    }
  };

  if ( !user )
  {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center text-gray-600 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        <div className="flex justify-end mb-6">
          <Link href="/admin/createpost">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Create New Post</Button>
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            { posts.map( post => (
              <li key={ post.id } className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">{ post.title }</h2>
                    <p className="text-sm text-gray-500">{ post.excerpt }</p>
                  </div>
                  <div className="flex space-x-4">
                    <Link href={ `/admin/editpost/${ post.id }` }>
                      <Button color="gray" className="text-blue-600 hover:text-blue-900">Edit</Button>
                    </Link>
                    <Button
                      color="gray"
                      className="text-red-600 hover:text-red-900"
                      onClick={ () =>
                      {
                        setPostToDelete( post );
                        setShowModal( true );
                      } }
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </li>
            ) ) }
          </ul>
        </div>

        <Modal
          show={ showModal }
          onClose={ () => setShowModal( false ) }
        >
          <Modal.Header>Confirm Deletion</Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this post? This action cannot be undone.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button color="gray" onClick={ () => setShowModal( false ) }>
              Cancel
            </Button>
            <Button color="red" onClick={ handleDelete }>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AdminDashboard;
