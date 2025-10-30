// routes/posts.js
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// GET /api/posts - Get all blog posts
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all posts...');
    const posts = await Post.find();
    console.log(`Found ${posts.length} posts`);
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/posts/:id - Get a specific blog post
router.get('/:id', async (req, res) => {
  try {
    console.log('Fetching post with ID:', req.params.id);
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    console.log('Post found:', post.title);
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    
    res.status(500).json({ error: error.message });
  }
});

// POST /api/posts - Create a new blog post
router.post('/', async (req, res) => {
  try {
    console.log('Creating new post with data:', req.body);
    
    const post = new Post(req.body);
    const savedPost = await post.save();
    
    console.log('Post created successfully:', savedPost.title);
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: error.errors ? Object.values(error.errors).map(e => e.message) : []
      });
    }
    
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/posts/:id - Update an existing blog post
router.put('/:id', async (req, res) => {
  try {
    console.log('Updating post with ID:', req.params.id);
    console.log('Update data:', req.body);
    
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    console.log('Post updated successfully:', post.title);
    res.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: error.errors ? Object.values(error.errors).map(e => e.message) : []
      });
    }
    
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/posts/:id - Delete a blog post
router.delete('/:id', async (req, res) => {
  try {
    console.log('Deleting post with ID:', req.params.id);
    
    const post = await Post.findByIdAndDelete(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    console.log('Post deleted successfully:', post.title);
    res.json({ message: 'Post deleted successfully', deletedPost: post });
  } catch (error) {
    console.error('Error deleting post:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;