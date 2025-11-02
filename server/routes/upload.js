// routes/upload.js
const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const path = require('path');

// POST /api/upload - Upload an image
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Return the file path that can be used to access the image
    const imageUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      message: 'Image uploaded successfully',
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// GET /api/upload/:filename - Serve uploaded images
router.get('/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, '../uploads', filename);
  
  res.sendFile(imagePath);
});

module.exports = router;