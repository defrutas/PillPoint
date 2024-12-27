import React, { useEffect, useState } from 'react';
import { User, LogOut } from 'lucide-react'; // Ensure lucide-react is installed
import './Navbar.css';

function Navbar() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Retrieve the user's name from local storage
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    if (firstName && lastName) {
      setUserName(`${firstName} ${lastName}`);
    }
  }, []);

  const handleLogout = () => {
    // Clear user data from local storage
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('authToken'); // Assuming you have an auth token saved

    // Redirect to the login page
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/images/logo.png" alt="Logo" className="h-8 w-8 mr-2" /> PillPoint
      </div>
      <div className="user-info">
        <User className="user-icon" />
        <span className="user-name">{userName || 'Guest'}</span>
        <LogOut className="logout-icon" onClick={handleLogout} title="Log Out" />
      </div>
    </nav>
  );
}

export default Navbar;
