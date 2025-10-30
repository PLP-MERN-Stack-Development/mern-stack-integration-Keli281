// src/pages/HomePage.jsx
import React from 'react';
import PostList from '../components/PostList';
import PostForm from '../components/PostForm';

const HomePage = () => {
  return (
    <div>
      <PostForm />
      <PostList />
    </div>
  );
};

export default HomePage;