// src/pages/PostPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postService } from '../services/api';
import Comments from '../components/Comments';

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await postService.getPost(id);
        setPost(postData);
      } catch (err) {
        setError('Post not found');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <div style={{ padding: '20px', color: '#000' }}>Loading post...</div>;
  if (error) return <div style={{ padding: '20px', color: '#000' }}>Error: {error}</div>;
  if (!post) return <div style={{ padding: '20px', color: '#000' }}>Post not found</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Link to="/" style={{ color: '#007bff', textDecoration: 'none', marginBottom: '20px', display: 'block' }}>
        ← Back to All Posts
      </Link>
      
      <div style={{ 
        border: '1px solid #ddd', 
        padding: '30px', 
        borderRadius: '8px',
        backgroundColor: '#978585ff',
        marginBottom: '30px'
      }}>
        <h1 style={{ margin: '0 0 20px 0', color: '#000' }}>{post.title}</h1>
        <div style={{ 
          color: '#000', 
          lineHeight: '1.6', 
          fontSize: '16px',
          marginBottom: '20px'
        }}>
          {post.content}
        </div>
        <div style={{ fontSize: '14px', color: '#333' }}>
          <p>Created: {new Date(post.createdAt).toLocaleDateString()}</p>
          {post.updatedAt && post.updatedAt !== post.createdAt && (
            <p>Updated: {new Date(post.updatedAt).toLocaleDateString()}</p>
          )}
          {post.slug && <p>Slug: {post.slug}</p>}
        </div>
      </div>

      {/* Comments Section */}
      <Comments postId={post._id} />
    </div>
  );
};

export default PostPage;