// src/components/Login.jsx
import React, { useState } from 'react';
import { authService } from '../services/api';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userData = await authService.login(formData);
      if (onLogin) {
        onLogin(userData);
      }
      alert('Login successful!');
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{ 
      maxWidth: '400px',
      margin: '50px auto',
      padding: '40px',
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      boxShadow: '0 15px 35px rgba(116, 185, 255, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.3)'
    }}>
      <h3 style={{ 
        textAlign: 'center', 
        marginBottom: '30px', 
        color: '#2d3436',
        fontSize: '2rem',
        fontWeight: '700',
        background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        Welcome Back
      </h3>
      
      {error && (
        <div style={{ 
          color: '#d63031', 
          backgroundColor: 'rgba(214, 48, 49, 0.1)',
          padding: '15px',
          borderRadius: '10px',
          marginBottom: '20px',
          border: '1px solid rgba(214, 48, 49, 0.2)',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600', 
            color: '#2d3436',
            fontSize: '14px'
          }}>
            Email:
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ 
              width: '100%', 
              padding: '15px', 
              border: '2px solid #dfe6e9',
              borderRadius: '10px',
              boxSizing: 'border-box',
              fontSize: '16px',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#74b9ff'}
            onBlur={(e) => e.target.style.borderColor = '#dfe6e9'}
          />
        </div>
        
        <div style={{ marginBottom: '25px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600', 
            color: '#2d3436',
            fontSize: '14px'
          }}>
            Password:
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ 
              width: '100%', 
              padding: '15px', 
              border: '2px solid #dfe6e9',
              borderRadius: '10px',
              boxSizing: 'border-box',
              fontSize: '16px',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#74b9ff'}
            onBlur={(e) => e.target.style.borderColor = '#dfe6e9'}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary"
          style={{ 
            width: '100%',
            padding: '15px',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          {loading ? (
            <span>
              <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
              Logging in...
            </span>
          ) : (
            'Sign In'
          )}
        </button>
      </form>
      
      <div style={{ 
        textAlign: 'center', 
        marginTop: '25px', 
        paddingTop: '20px',
        borderTop: '1px solid #dfe6e9'
      }}>
        <p style={{ color: '#636e72', marginBottom: '15px' }}>
          Don't have an account?
        </p>
        <a 
          href="/register" 
          className="btn-secondary"
          style={{
            display: 'inline-block',
            textDecoration: 'none',
            padding: '12px 25px'
          }}
        >
          Create Account
        </a>
      </div>
    </div>
  );
};

export default Login;