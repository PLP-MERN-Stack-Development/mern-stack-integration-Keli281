// src/pages/HomePage.jsx
import React from 'react';
import PostList from '../components/PostList';
import PostForm from '../components/PostForm';

const HomePage = () => {
  return (
    <div style={{ 
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      width: '100%'
    }}>
      <PostForm />
      <PostList />
    </div>
  );
};

export default HomePage;