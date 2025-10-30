// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CategoriesProvider } from './context/CategoriesContext';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

// Header component with auth status
const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    alert('Logged out successfully!');
  };

  return (
    <header className="App-header" style={{ 
      padding: '20px', 
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h1 style={{ margin: 0 }}>
        <a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          MERN Blog
        </a>
      </h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {user ? (
          <>
            <span style={{ color: '#000' }}>Welcome, {user.username}!</span>
            <button 
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <a href="/login" style={{ color: '#007bff', textDecoration: 'none' }}>Login</a>
            <span style={{ color: '#000' }}>|</span>
            <a href="/register" style={{ color: '#007bff', textDecoration: 'none' }}>Register</a>
          </div>
        )}
      </div>
    </header>
  );
};

// Main App Component
function AppContent() {
  const { login, register, user } = useAuth();

  return (
    <div className="App">
      <Header />
      <main style={{ minHeight: 'calc(100vh - 80px)' }}>
        <Routes>
          {/* If user tries to access login/register while logged in, redirect to home */}
          <Route path="/login" element={
            user ? <Navigate to="/" replace /> : <Login onLogin={login} />
          } />
          <Route path="/register" element={
            user ? <Navigate to="/" replace /> : <Register onRegister={register} />
          } />
          
          {/* If user tries to access home while not logged in, redirect to login */}
          <Route path="/" element={
            user ? <HomePage /> : <Navigate to="/login" replace />
          } />
          
          <Route path="/posts/:id" element={<PostPage />} />
        </Routes>
      </main>
    </div>
  );
}

// Root App Component with Providers
function App() {
  return (
    <Router>
      <AuthProvider>
        <CategoriesProvider>
          <AppContent />
        </CategoriesProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;