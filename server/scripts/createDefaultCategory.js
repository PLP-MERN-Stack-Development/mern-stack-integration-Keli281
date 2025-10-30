// createDefaultCategory.js
const mongoose = require('mongoose');
const Category = require('../models/Category');
require('dotenv').config();

async function createDefaultCategory() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if "General" category already exists
    const existingCategory = await Category.findOne({ name: 'General' });
    
    if (existingCategory) {
      console.log('General category already exists:', existingCategory);
    } else {
      // Create the default category
      const defaultCategory = new Category({
        name: 'General',
        description: 'General blog posts'
      });
      
      await defaultCategory.save();
      console.log('Default category created:', defaultCategory);
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
  }
}

createDefaultCategory();