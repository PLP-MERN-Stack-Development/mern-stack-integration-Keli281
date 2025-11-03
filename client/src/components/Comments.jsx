// src/components/Comments.jsx
import React, { useState, useEffect } from 'react';
import { postService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const fetchComments = async () => {
    try {
      const commentsData = await postService.getPost(postId);
      setComments(commentsData.comments || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      await postService.addComment(postId, {
        content: newComment,
        userId: user._id,
        username: user.username
      });

      setNewComment('');
      // Refresh comments
      fetchComments();
    } catch (error) {
      alert('Error adding comment: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{ marginTop: '40px' }}>
      <h4 style={{ 
        color: '#2d3436', 
        marginBottom: '25px', 
        fontSize: '1.8rem',
        fontWeight: '700',
        background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        Comments ({comments.length})
      </h4>
      
      {/* Add Comment Form */}
      {user ? (
        <div className="card-hover" style={{
          padding: '25px',
          marginBottom: '30px',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '15px',
          boxShadow: '0 8px 25px rgba(116, 185, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          <form onSubmit={handleAddComment}>
            <label style={{ 
              display: 'block', 
              marginBottom: '12px', 
              fontWeight: '600', 
              color: '#2d3436',
              fontSize: '16px'
            }}>
              Add a Comment:
            </label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              required
              style={{
                width: '100%',
                height: '120px',
                padding: '15px',
                border: '2px solid #dfe6e9',
                borderRadius: '10px',
                marginBottom: '15px',
                resize: 'vertical',
                fontSize: '16px',
                transition: 'all 0.3s ease',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => e.target.style.borderColor = '#74b9ff'}
              onBlur={(e) => e.target.style.borderColor = '#dfe6e9'}
            />
            <button
              type="submit"
              disabled={loading || !newComment.trim()}
              className="btn-primary"
              style={{
                padding: '12px 24px',
                fontSize: '16px'
              }}
            >
              {loading ? (
                <span>
                  <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                  Adding...
                </span>
              ) : (
                'Post Comment'
              )}
            </button>
          </form>
        </div>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '30px',
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '15px',
          marginBottom: '30px'
        }}>
          <p style={{ color: '#2d3436', marginBottom: '15px', fontSize: '16px' }}>
            Please login to add comments.
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <a 
              href="/login" 
              className="btn-primary"
              style={{ 
                textDecoration: 'none',
                padding: '10px 20px'
              }}
            >
              Login
            </a>
            <a 
              href="/register" 
              className="btn-secondary"
              style={{ 
                textDecoration: 'none',
                padding: '10px 20px'
              }}
            >
              Register
            </a>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div>
        {comments.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '15px',
            color: '#636e72'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>💬</div>
            <p style={{ fontSize: '16px', fontWeight: '600' }}>
              No comments yet. Be the first to comment!
            </p>
          </div>
        ) : (
          comments.map((comment, index) => (
            <div
              key={index}
              className="fade-in card-hover"
              style={{
                padding: '20px',
                marginBottom: '20px',
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '15px',
                boxShadow: '0 5px 20px rgba(116, 185, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '12px',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>
                    {comment.username.charAt(0).toUpperCase()}
                  </div>
                  <strong style={{ color: '#2d3436', fontSize: '16px' }}>
                    {comment.username}
                  </strong>
                </div>
                <span style={{ 
                  color: '#636e72', 
                  fontSize: '12px',
                  background: 'rgba(116, 185, 255, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '10px'
                }}>
                  {new Date(comment.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <p style={{ 
                color: '#2d3436', 
                margin: 0, 
                lineHeight: '1.6',
                fontSize: '15px'
              }}>
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;