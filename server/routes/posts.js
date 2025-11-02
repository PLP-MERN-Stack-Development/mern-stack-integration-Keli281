// routes/posts.js
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// GET /api/posts - Get all blog posts with pagination, search, and filtering
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category || '';

    console.log(`Fetching posts - Page: ${page}, Limit: ${limit}, Search: "${search}", Category: "${category}"`);
    
    // Build query for search and filtering
    let query = {};
    
    // Search in title and content
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by category
    if (category) {
      query.category = category;
    }

    // Get posts with pagination, search, and filtering
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination info
    const totalPosts = await Post.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limit);

    console.log(`Found ${posts.length} posts (Page ${page} of ${totalPages})`);
    
    res.json({
      posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      filters: {
        search,
        category
      }
    });
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

// POST /api/posts/:id/comments - Add a comment to a post
router.post('/:id/comments', async (req, res) => {
  try {
    const { content, userId, username } = req.body;
    
    if (!content || !userId || !username) {
      return res.status(400).json({ 
        error: 'Content, userId, and username are required' 
      });
    }

    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Add the comment
    post.comments.push({
      user: userId,
      username: username,
      content: content,
      createdAt: new Date()
    });

    const savedPost = await post.save();
    
    // Return the newly added comment (last one in the array)
    const newComment = savedPost.comments[savedPost.comments.length - 1];
    
    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    
    res.status(400).json({ error: error.message });
  }
});

// GET /api/posts/:id/comments - Get all comments for a post
router.get('/:id/comments', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).select('comments');
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post.comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;