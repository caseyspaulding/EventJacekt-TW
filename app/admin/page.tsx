'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import type { Post } from '../../types/Post';

const AdminDashboard = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const supabase = createClient();
            const {
                data: { user }
            } = await supabase.auth.getUser();

            if (user?.email !== 'casey.spaulding@outlook.com') {
                router.push('/login'); // redirect to login if not admin
                return;
            }

            setUser(user);

            // Fetch all blog posts
            const { data: posts } = await supabase.from('blog_posts').select('*');
            setPosts(posts || []);
        };

        checkUser();
    }, [router]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <ul>
                {posts.map((post) => (
                    <li key={post.id}>
                        <h2>{post.title}</h2>
                        <a href={`/admin/edit/${post.id}`}>Edit</a> |{' '}
                        <a href={`/admin/delete/${post.id}`}>Delete</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminDashboard;
