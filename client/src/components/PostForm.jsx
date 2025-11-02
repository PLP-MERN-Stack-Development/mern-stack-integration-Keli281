// src/components/PostForm.jsx
import React, { useState } from 'react';
import { postService } from '../services/api';
import { useCategories } from '../context/CategoriesContext';
import { useAuth } from '../context/AuthContext';

const PostForm = ({ onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [featuredImage, setFeaturedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { categories, loading: categoriesLoading } = useCategories();
  const { user } = useAuth();

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFeaturedImage(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Upload image to server
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Image upload failed');
    }

    const data = await response.json();
    return data.imageUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to create a post');
      return;
    }

    if (!selectedCategory && categories.length > 0) {
      alert('Please select a category');
      return;
    }

    setLoading(true);
    
    try {
      let imageUrl = '';
      
      // Upload image if selected
      if (featuredImage) {
        setUploadingImage(true);
        imageUrl = await uploadImage(featuredImage);
        setUploadingImage(false);
      }

      // Create post with image URL
      await postService.createPost({
        title,
        content,
        category: selectedCategory || (categories.length > 0 ? categories[0]._id : ''),
        author: user._id,
        featuredImage: imageUrl
      });
      
      // Reset form
      setTitle('');
      setContent('');
      setFeaturedImage(null);
      setImagePreview('');
      if (categories.length > 0) {
        setSelectedCategory(categories[0]._id);
      }
      alert('Post created successfully!');
      
      // Refresh the post list
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      alert('Error creating post: ' + error.message);
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setFeaturedImage(null);
    setImagePreview('');
  };

  return (
    <div style={{ 
      border: '1px solid #ddd', 
      padding: '30px', 
      margin: '20px 0', 
      borderRadius: '8px',
      backgroundColor: '#978585ff',
      maxWidth: '600px',
      marginLeft: 'auto',
      marginRight: 'auto'
    }}>
      <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#000' }}>
        {user ? 'Create New Post' : 'Please Login to Create Posts'}
      </h3>
      
      {user ? (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#000' }}>
              Title:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {!categoriesLoading && categories.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#000' }}>
                Category:
              </label>
              <select
                value={selectedCategory || (categories.length > 0 ? categories[0]._id : '')}
                onChange={(e) => setSelectedCategory(e.target.value)}
                required
                disabled={loading}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  boxSizing: 'border-box',
                  backgroundColor: 'white',
                  color: '#000'
                }}
              >
                {categories.map(category => (
                  <option 
                    key={category._id} 
                    value={category._id}
                    style={{ color: '#000', backgroundColor: 'white' }}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Image Upload Section */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#000' }}>
              Featured Image:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading || uploadingImage}
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxSizing: 'border-box',
                backgroundColor: 'white'
              }}
            />
            {uploadingImage && (
              <p style={{ color: '#000', fontSize: '14px', margin: '5px 0' }}>
                Uploading image...
              </p>
            )}
            
            {/* Image Preview */}
            {imagePreview && (
              <div style={{ marginTop: '10px' }}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '200px', 
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }} 
                />
                <button
                  type="button"
                  onClick={removeImage}
                  style={{
                    marginTop: '5px',
                    padding: '5px 10px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#000' }}>
              Content:
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              disabled={loading}
              style={{ 
                width: '100%', 
                height: '120px', 
                padding: '10px', 
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading || uploadingImage}
            style={{ 
              padding: '12px 30px', 
              backgroundColor: (loading || uploadingImage) ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: (loading || uploadingImage) ? 'not-allowed' : 'pointer',
              display: 'block',
              margin: '0 auto',
              fontSize: '16px'
            }}
          >
            {loading ? 'Creating Post...' : uploadingImage ? 'Uploading Image...' : 'Create Post'}
          </button>
        </form>
      ) : (
        <div style={{ textAlign: 'center', color: '#000' }}>
          <p>You need to be logged in to create posts.</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '15px' }}>
            <a 
              href="/login" 
              style={{ 
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px'
              }}
            >
              Login
            </a>
            <a 
              href="/register" 
              style={{ 
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px'
              }}
            >
              Register
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostForm;