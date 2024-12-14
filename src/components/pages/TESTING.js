import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';  // Updated import
import './Login.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        console.log('Login successful:', data);
        // Save token or session details
        localStorage.setItem('token', data.token);

        // Decode the token to get user details, such as role (isAdmin)
        const decoded = jwtDecode(data.token);
        console.log('Decoded Token:', decoded);

        if (decoded.isAdmin) {
          // Redirect to admin dashboard if user is an admin
          window.location.href = '/admin-dashboard';
        } else {
          // Redirect to regular user dashboard
          window.location.href = '/dashboard';
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
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
