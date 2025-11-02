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
    <div style={{ marginTop: '30px' }}>
      <h4 style={{ color: '#000', marginBottom: '15px' }}>Comments ({comments.length})</h4>
      
      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleAddComment} style={{ marginBottom: '20px' }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            required
            style={{
              width: '100%',
              height: '80px',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginBottom: '10px',
              resize: 'vertical'
            }}
          />
          <button
            type="submit"
            disabled={loading || !newComment.trim()}
            style={{
              padding: '8px 16px',
              backgroundColor: loading ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Adding...' : 'Add Comment'}
          </button>
        </form>
      ) : (
        <p style={{ color: '#000', marginBottom: '20px' }}>
          Please <a href="/login" style={{ color: '#007bff' }}>login</a> to add comments.
        </p>
      )}

      {/* Comments List */}
      <div>
        {comments.length === 0 ? (
          <p style={{ color: '#000', fontStyle: 'italic' }}>No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment, index) => (
            <div
              key={index}
              style={{
                border: '1px solid #ddd',
                padding: '15px',
                marginBottom: '10px',
                borderRadius: '8px',
                backgroundColor: '#f8f9fa'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <strong style={{ color: '#000' }}>{comment.username}</strong>
                <span style={{ color: '#666', fontSize: '12px' }}>
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p style={{ color: '#000', margin: 0, lineHeight: '1.4' }}>
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