// src/components/PostList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../services/api';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const postsData = await postService.getAllPosts();
      setPosts(postsData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await postService.deletePost(postId);
      // Remove the post from the local state
      setPosts(posts.filter(post => post._id !== postId));
      alert('Post deleted successfully!');
    } catch (error) {
      alert('Error deleting post: ' + error.message);
    }
  };

  const startEdit = (post) => {
    setEditingPost(post._id);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const cancelEdit = () => {
    setEditingPost(null);
    setEditTitle('');
    setEditContent('');
  };

  const handleUpdate = async (postId) => {
    try {
      const updatedPost = await postService.updatePost(postId, {
        title: editTitle,
        content: editContent
      });

      // Update the post in the local state
      setPosts(posts.map(post => 
        post._id === postId ? updatedPost : post
      ));

      setEditingPost(null);
      setEditTitle('');
      setEditContent('');
      alert('Post updated successfully!');
    } catch (error) {
      alert('Error updating post: ' + error.message);
    }
  };

  if (loading) return <div style={{ color: '#000' }}>Loading posts...</div>;
  if (error) return <div style={{ color: '#000' }}>Error: {error}</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ color: '#000' }}>Blog Posts</h2>
      {posts.length === 0 ? (
        <p style={{ color: '#000' }}>No posts yet. Create your first post!</p>
      ) : (
        <div>
          {posts.map(post => (
            <div key={post._id} style={{ 
              border: '1px solid #ddd', 
              padding: '20px', 
              margin: '15px 0', 
              borderRadius: '8px',
              backgroundColor: '#978585ff'
            }}>
              {editingPost === post._id ? (
                // Edit mode
                <div>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '8px', 
                      marginBottom: '10px',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      backgroundColor: 'white',
                      color: '#000',
                      border: '1px solid #ccc'
                    }}
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    style={{ 
                      width: '100%', 
                      height: '120px', 
                      padding: '8px',
                      marginBottom: '10px',
                      backgroundColor: 'white',
                      color: '#000',
                      border: '1px solid #ccc'
                    }}
                  />
                  <div>
                    <button 
                      onClick={() => handleUpdate(post._id)}
                      style={{ 
                        padding: '8px 16px', 
                        marginRight: '10px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Save
                    </button>
                    <button 
                      onClick={cancelEdit}
                      style={{ 
                        padding: '8px 16px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View mode
                <div>
                  <h3 style={{ margin: '0 0 10px 0' }}>
                    <Link 
                      to={`/posts/${post._id}`} 
                      style={{ color: '#000', textDecoration: 'none' }}
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <p style={{ margin: '0 0 15px 0', lineHeight: '1.5', color: '#000' }}>
                    {post.content}
                  </p>
                  <div style={{ fontSize: '12px', color: '#333', marginBottom: '10px' }}>
                    Created: {new Date(post.createdAt).toLocaleDateString()}
                    {post.slug && ` • Slug: ${post.slug}`}
                  </div>
                  <div>
                    <button 
                      onClick={() => startEdit(post)}
                      style={{ 
                        padding: '6px 12px', 
                        marginRight: '10px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(post._id)}
                      style={{ 
                        padding: '6px 12px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;