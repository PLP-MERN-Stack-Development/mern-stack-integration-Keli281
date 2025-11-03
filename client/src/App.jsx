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
    <header style={{ 
      padding: '20px', 
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: '1200px',
      margin: '0 auto',
      background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
      borderRadius: '0 0 15px 15px',
      boxShadow: '0 4px 15px rgba(116, 185, 255, 0.3)',
      color: 'white',
      marginBottom: '30px'
    }}>
      <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700' }}>
        <a href="/" style={{ color: 'white', textDecoration: 'none' }} className="pulse">
          MERN Blog
        </a>
      </h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {user ? (
          <>
            <span style={{ fontSize: '16px', fontWeight: '500' }}>
              Welcome, {user.username}!
            </span>
            <button 
              onClick={handleLogout}
              className="btn-danger"
              style={{
                padding: '8px 16px',
                fontSize: '14px'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '15px' }}>
            <a 
              href="/login" 
              style={{ 
                color: 'white', 
                textDecoration: 'none',
                padding: '8px 16px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                fontWeight: '500'
              }}
              className="pulse"
            >
              Login
            </a>
            <a 
              href="/register" 
              style={{ 
                color: 'white', 
                textDecoration: 'none',
                padding: '8px 16px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                fontWeight: '500'
              }}
              className="pulse"
            >
              Register
            </a>
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
      <main style={{ 
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        flexDirection: 'column'
      }}>
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
            user ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <HomePage />
              </div>
            ) : <Navigate to="/login" replace />
          } />
          
          <Route path="/posts/:id" element={
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <PostPage />
            </div>
          } />
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