// scripts/addMoreCategories.js
const mongoose = require('mongoose');
const Category = require('../models/Category');
require('dotenv').config();

async function addMoreCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const categories = [
      { name: 'Technology', description: 'Posts about technology and programming' },
      { name: 'Lifestyle', description: 'Posts about lifestyle and personal development' },
      { name: 'Travel', description: 'Posts about travel experiences and tips' },
      { name: 'Food', description: 'Posts about food, recipes, and cooking' },
      { name: 'Sports', description: 'Posts about sports and fitness' }
    ];

    for (const categoryData of categories) {
      const existingCategory = await Category.findOne({ name: categoryData.name });
      
      if (existingCategory) {
        console.log(`Category "${categoryData.name}" already exists`);
      } else {
        const category = new Category(categoryData);
        await category.save();
        console.log(`Category created: ${categoryData.name}`);
      }
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
  }
}

addMoreCategories();