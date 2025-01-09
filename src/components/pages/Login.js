import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';  // Updated import
import { useNavigate } from 'react-router-dom'; // Use useNavigate for redirects
import './Login.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook to navigate programmatically

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://4.211.87.132:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token) {
          // Store token in localStorage with the same key as in Request component
          localStorage.setItem('authToken', data.token);

          // Decode the JWT token
          const decoded = jwtDecode(data.token);

          // Store user's first and last name
          localStorage.setItem('firstName', decoded.firstName || 'User');
          localStorage.setItem('lastName', decoded.lastName || '');

          // Navigate based on user role
          if (decoded.isAdmin) {
            navigate('/admin-dashboard');  // Admin-specific route
          } else {
            navigate('/user-dashboard');  // Regular user route
          }
        } else {
          setError(data?.message || 'Token not received in response.');
        }
      } else {
        setError(data?.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: "url('/images/pillpoint.webp')" }}>
      <div className="login-card">
        <div className="login-title">
          <img src="/images/logo.png" alt="Logo" className="h-8 w-8 mr-2" /> PillPoint
        </div>
        <form onSubmit={handleSubmit}>
          <div className="login-input-group">
            <label htmlFor="email" className="login-label">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              required
            />
          </div>
          <div className="login-input-group">
            <label htmlFor="password" className="login-label">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required
            />
          </div>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
