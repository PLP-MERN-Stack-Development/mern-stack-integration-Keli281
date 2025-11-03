// src/components/PostList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../services/api';
import SearchAndFilter from './SearchAndFilter';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const postsPerPage = 5;

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const fetchPosts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await postService.getAllPosts(page, postsPerPage, searchTerm, categoryFilter);
      setPosts(response.posts);
      setTotalPages(response.pagination.totalPages);
      setTotalPosts(response.pagination.totalPosts);
      setError(null);
    } catch (err) {
      setError('Failed to fetch posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (search) => {
    setSearchTerm(search);
    setCurrentPage(1);
    fetchPosts(1);
  };

  const handleFilter = (category) => {
    setCategoryFilter(category);
    setCurrentPage(1);
    fetchPosts(1);
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await postService.deletePost(postId);
      fetchPosts(currentPage);
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

  // Pagination controls
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchPosts(page);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        marginTop: '30px',
        gap: '10px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={currentPage === 1 ? 'btn-secondary' : 'btn-primary'}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            minWidth: '100px'
          }}
        >
          Previous
        </button>

        <span style={{ 
          color: '#2d3436', 
          margin: '0 15px',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={currentPage === totalPages ? 'btn-secondary' : 'btn-primary'}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            minWidth: '100px'
          }}
        >
          Next
        </button>
      </div>
    );
  };

  if (loading) return (
    <div style={{ 
      color: '#2d3436', 
      textAlign: 'center', 
      padding: '40px',
      fontSize: '18px'
    }}>
      <i className="fas fa-spinner fa-spin" style={{ marginRight: '10px' }}></i>
      Loading posts...
    </div>
  );
  
  if (error) return (
    <div style={{ 
      color: '#d63031', 
      textAlign: 'center', 
      padding: '40px',
      fontSize: '18px'
    }}>
      Error: {error}
    </div>
  );

  return (
    <div style={{ 
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '20px',
      minHeight: '80vh',
      width: '100%'
    }}>
      {/* Search and Filter Component */}
      <SearchAndFilter 
        onSearch={handleSearch}
        onFilter={handleFilter}
        currentFilters={{ search: searchTerm, category: categoryFilter }}
      />

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <h2 style={{ 
          color: '#2d3436', 
          margin: 0,
          fontSize: '2rem',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Blog Posts
        </h2>
        <span style={{ 
          color: '#636e72', 
          fontSize: '14px',
          fontWeight: '600',
          background: 'rgba(116, 185, 255, 0.1)',
          padding: '8px 16px',
          borderRadius: '20px'
        }}>
          {totalPosts} total posts
          {(searchTerm || categoryFilter) && ' (filtered)'}
        </span>
      </div>
      
      {posts.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '20px',
          margin: '20px 0'
        }}>
          <div style={{ 
            fontSize: '4rem',
            color: '#dfe6e9',
            marginBottom: '20px'
          }}>
            📝
          </div>
          <p style={{ 
            color: '#2d3436', 
            fontSize: '18px', 
            marginBottom: '10px',
            fontWeight: '600'
          }}>
            {searchTerm || categoryFilter ? 'No posts match your search criteria' : 'No posts yet'}
          </p>
          {(searchTerm || categoryFilter) && (
            <p style={{ color: '#636e72', fontSize: '14px' }}>
              Try adjusting your search or filter settings
            </p>
          )}
        </div>
      ) : (
        <div>
          {posts.map((post, index) => (
            <div 
              key={post._id} 
              className={`fade-in card-hover`}
              style={{ 
                animationDelay: `${index * 0.1}s`,
                padding: '25px', 
                margin: '25px 0', 
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                boxShadow: '0 8px 25px rgba(116, 185, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              {editingPost === post._id ? (
                // Edit mode
                <div>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '15px', 
                      marginBottom: '15px',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      backgroundColor: 'white',
                      color: '#2d3436',
                      border: '2px solid #dfe6e9',
                      borderRadius: '10px',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#74b9ff'}
                    onBlur={(e) => e.target.style.borderColor = '#dfe6e9'}
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    style={{ 
                      width: '100%', 
                      height: '150px', 
                      padding: '15px',
                      marginBottom: '15px',
                      backgroundColor: 'white',
                      color: '#2d3436',
                      border: '2px solid #dfe6e9',
                      borderRadius: '10px',
                      resize: 'vertical',
                      transition: 'all 0.3s ease',
                      fontFamily: 'inherit'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#74b9ff'}
                    onBlur={(e) => e.target.style.borderColor = '#dfe6e9'}
                  />
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => handleUpdate(post._id)}
                      className="btn-success"
                      style={{ padding: '10px 20px' }}
                    >
                      Save Changes
                    </button>
                    <button 
                      onClick={cancelEdit}
                      className="btn-secondary"
                      style={{ padding: '10px 20px' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View mode
                <div>
                  {/* Featured Image */}
                  {post.featuredImage && (
                    <div style={{ marginBottom: '20px' }}>
                      <img 
                        src={`http://localhost:5000${post.featuredImage}`}
                        alt={post.title}
                        style={{
                          width: '100%',
                          maxHeight: '400px',
                          objectFit: 'cover',
                          borderRadius: '15px',
                          border: '2px solid #dfe6e9',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                    </div>
                  )}
                  
                  <h3 style={{ 
                    margin: '0 0 15px 0',
                    fontSize: '1.5rem',
                    fontWeight: '700'
                  }}>
                    <Link 
                      to={`/posts/${post._id}`} 
                      style={{ 
                        color: '#2d3436', 
                        textDecoration: 'none',
                        background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                      className="pulse"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  
                  <p style={{ 
                    margin: '0 0 20px 0', 
                    lineHeight: '1.6', 
                    color: '#2d3436',
                    fontSize: '16px'
                  }}>
                    {post.content}
                  </p>
                  
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#636e72', 
                    marginBottom: '20px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '15px'
                  }}>
                    <span>
                      <i className="far fa-calendar" style={{ marginRight: '5px' }}></i>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    {post.comments && (
                      <span>
                        <i className="far fa-comments" style={{ marginRight: '5px' }}></i>
                        {post.comments.length} comments
                      </span>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => startEdit(post)}
                      className="btn-primary"
                      style={{ padding: '8px 16px', fontSize: '14px' }}
                    >
                      <i className="fas fa-edit" style={{ marginRight: '5px' }}></i>
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(post._id)}
                      className="btn-danger"
                      style={{ padding: '8px 16px', fontSize: '14px' }}
                    >
                      <i className="fas fa-trash" style={{ marginRight: '5px' }}></i>
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* Pagination Controls */}
          {renderPagination()}
        </div>
      )}
    </div>
  );
};

export default PostList;