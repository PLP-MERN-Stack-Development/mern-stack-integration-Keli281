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

  if (loading) return (
    <div style={{ 
      color: '#2d3436', 
      textAlign: 'center', 
      padding: '60px 20px',
      fontSize: '18px'
    }}>
      <i className="fas fa-spinner fa-spin" style={{ marginRight: '10px' }}></i>
      Loading post...
    </div>
  );
  
  if (error) return (
    <div style={{ 
      color: '#d63031', 
      textAlign: 'center', 
      padding: '60px 20px',
      fontSize: '18px'
    }}>
      Error: {error}
    </div>
  );
  
  if (!post) return (
    <div style={{ 
      color: '#2d3436', 
      textAlign: 'center', 
      padding: '60px 20px',
      fontSize: '18px'
    }}>
      Post not found
    </div>
  );

  return (
    <div style={{ 
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      minHeight: '100vh',
      width: '100%'
    }}>
      <Link 
        to="/" 
        style={{ 
          color: '#74b9ff', 
          textDecoration: 'none',
          fontSize: '16px',
          fontWeight: '600',
          display: 'inline-flex',
          alignItems: 'center',
          marginBottom: '30px',
          transition: 'all 0.3s ease'
        }}
        className="pulse"
      >
        <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i>
        Back to All Posts
      </Link>
      
      <div className="fade-in card-hover" style={{ 
        padding: '40px', 
        marginBottom: '40px',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        boxShadow: '0 15px 35px rgba(116, 185, 255, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.3)'
      }}>
        {/* Featured Image */}
        {post.featuredImage && (
          <div style={{ marginBottom: '30px' }}>
            <img 
              src={`http://localhost:5000${post.featuredImage}`}
              alt={post.title}
              style={{
                width: '100%',
                maxHeight: '500px',
                objectFit: 'cover',
                borderRadius: '15px',
                border: '2px solid #dfe6e9',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
              }}
            />
          </div>
        )}
        
        <h1 style={{ 
          margin: '0 0 25px 0', 
          color: '#2d3436',
          fontSize: '2.5rem',
          fontWeight: '800',
          lineHeight: '1.2',
          background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {post.title}
        </h1>
        
        <div style={{ 
          color: '#2d3436', 
          lineHeight: '1.7', 
          fontSize: '18px',
          marginBottom: '30px'
        }}>
          {post.content}
        </div>
        
        <div style={{ 
          fontSize: '14px', 
          color: '#636e72',
          padding: '20px',
          background: 'rgba(116, 185, 255, 0.1)',
          borderRadius: '15px',
          border: '1px solid rgba(116, 185, 255, 0.2)'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <strong style={{ color: '#2d3436' }}>Created:</strong>{' '}
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            
            {post.updatedAt && post.updatedAt !== post.createdAt && (
              <div>
                <strong style={{ color: '#2d3436' }}>Updated:</strong>{' '}
                {new Date(post.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            )}
            
            {post.slug && (
              <div>
                <strong style={{ color: '#2d3436' }}>Slug:</strong>{' '}
                {post.slug}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <Comments postId={post._id} />
    </div>
  );
};

export default PostPage;