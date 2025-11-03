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
    <div className="fade-in card-hover" style={{ 
      padding: '30px', 
      margin: '30px auto', 
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(116, 185, 255, 0.15)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      maxWidth: '700px',
      width: '90%' // Added this line for better centering
    }}>
      <h3 style={{ 
        textAlign: 'center', 
        marginBottom: '25px', 
        color: '#2d3436',
        fontSize: '1.8rem',
        fontWeight: '700',
        background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        {user ? 'Create New Post' : 'Please Login to Create Posts'}
      </h3>
      
      {user ? (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#2d3436',
              fontSize: '14px'
            }}>
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
                padding: '15px', 
                border: '2px solid #dfe6e9',
                borderRadius: '10px',
                boxSizing: 'border-box',
                fontSize: '16px',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#74b9ff'}
              onBlur={(e) => e.target.style.borderColor = '#dfe6e9'}
            />
          </div>

          {!categoriesLoading && categories.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600', 
                color: '#2d3436',
                fontSize: '14px'
              }}>
                Category:
              </label>
              <select
                value={selectedCategory || (categories.length > 0 ? categories[0]._id : '')}
                onChange={(e) => setSelectedCategory(e.target.value)}
                required
                disabled={loading}
                style={{ 
                  width: '100%', 
                  padding: '15px', 
                  border: '2px solid #dfe6e9',
                  borderRadius: '10px',
                  boxSizing: 'border-box',
                  backgroundColor: 'white',
                  color: '#2d3436',
                  fontSize: '16px',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#74b9ff'}
                onBlur={(e) => e.target.style.borderColor = '#dfe6e9'}
              >
                {categories.map(category => (
                  <option 
                    key={category._id} 
                    value={category._id}
                    style={{ color: '#2d3436', backgroundColor: 'white' }}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Image Upload Section */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#2d3436',
              fontSize: '14px'
            }}>
              Featured Image:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading || uploadingImage}
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '2px solid #dfe6e9',
                borderRadius: '10px',
                boxSizing: 'border-box',
                backgroundColor: 'white',
                fontSize: '14px',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#74b9ff'}
              onBlur={(e) => e.target.style.borderColor = '#dfe6e9'}
            />
            {uploadingImage && (
              <p style={{ color: '#636e72', fontSize: '14px', margin: '10px 0' }}>
                <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                Uploading image...
              </p>
            )}
            
            {/* Image Preview */}
            {imagePreview && (
              <div style={{ marginTop: '15px' }}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '200px', 
                    borderRadius: '10px',
                    border: '2px solid #dfe6e9',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="btn-danger"
                  style={{
                    marginTop: '10px',
                    padding: '8px 16px',
                    fontSize: '14px'
                  }}
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#2d3436',
              fontSize: '14px'
            }}>
              Content:
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              disabled={loading}
              style={{ 
                width: '100%', 
                height: '150px', 
                padding: '15px', 
                border: '2px solid #dfe6e9',
                borderRadius: '10px',
                boxSizing: 'border-box',
                resize: 'vertical',
                fontSize: '16px',
                transition: 'all 0.3s ease',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => e.target.style.borderColor = '#74b9ff'}
              onBlur={(e) => e.target.style.borderColor = '#dfe6e9'}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading || uploadingImage}
            className="btn-primary"
            style={{ 
              width: '100%',
              padding: '15px',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            {loading ? 'Creating Post...' : uploadingImage ? 'Uploading Image...' : 'Create Post'}
          </button>
        </form>
      ) : (
        <div style={{ textAlign: 'center', color: '#2d3436' }}>
          <p style={{ fontSize: '16px', marginBottom: '20px' }}>You need to be logged in to create posts.</p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px' }}>
            <a 
              href="/login" 
              className="btn-primary"
              style={{ 
                textDecoration: 'none',
                padding: '12px 25px'
              }}
            >
              Login
            </a>
            <a 
              href="/register" 
              className="btn-secondary"
              style={{ 
                textDecoration: 'none',
                padding: '12px 25px'
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