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
  const postsPerPage = 5; // Show 5 posts per page

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
    setCurrentPage(1); // Reset to first page when searching
    fetchPosts(1); // Fetch first page with new search
  };

  const handleFilter = (category) => {
    setCategoryFilter(category);
    setCurrentPage(1); // Reset to first page when filtering
    fetchPosts(1); // Fetch first page with new filter
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await postService.deletePost(postId);
      // Refresh the current page
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
        gap: '10px'
      }}>
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: '8px 16px',
            backgroundColor: currentPage === 1 ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
          }}
        >
          Previous
        </button>

        <span style={{ color: '#000', margin: '0 15px' }}>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: '8px 16px',
            backgroundColor: currentPage === totalPages ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
          }}
        >
          Next
        </button>
      </div>
    );
  };

  if (loading) return <div style={{ color: '#000', textAlign: 'center', padding: '20px' }}>Loading posts...</div>;
  if (error) return <div style={{ color: '#000', textAlign: 'center', padding: '20px' }}>Error: {error}</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {/* Search and Filter Component */}
      <SearchAndFilter 
        onSearch={handleSearch}
        onFilter={handleFilter}
        currentFilters={{ search: searchTerm, category: categoryFilter }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#000', margin: 0 }}>Blog Posts</h2>
        <span style={{ color: '#000', fontSize: '14px' }}>
          {totalPosts} total posts
          {(searchTerm || categoryFilter) && ' (filtered)'}
        </span>
      </div>
      
      {posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#000', fontSize: '18px', marginBottom: '10px' }}>
            {searchTerm || categoryFilter ? 'No posts match your search criteria' : 'No posts yet'}
          </p>
          {(searchTerm || categoryFilter) && (
            <p style={{ color: '#000', fontSize: '14px' }}>
              Try adjusting your search or filter settings
            </p>
          )}
        </div>
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
                  {/* Featured Image */}
                  {post.featuredImage && (
                    <div style={{ marginBottom: '15px' }}>
                      <img 
                        src={`http://localhost:5000${post.featuredImage}`}
                        alt={post.title}
                        style={{
                          width: '100%',
                          maxHeight: '300px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid #ddd'
                        }}
                      />
                    </div>
                  )}
                  
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
                    {post.comments && ` • ${post.comments.length} comments`}
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
          
          {/* Pagination Controls */}
          {renderPagination()}
        </div>
      )}
    </div>
  );
};

export default PostList;