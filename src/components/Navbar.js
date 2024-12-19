import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react'; // Ensure lucide-react is installed for icons
import './Navbar.css';  // Assuming it's in the same directory

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


  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/images/logo.png" alt="Logo" className="h-8 w-8 mr-2" /> PillPoint
      </div>
      <div className="user-info">
        <User className="user-icon" />
        <span className="user-name">{userName || 'Guest'}</span>
      </div>
    </nav>
  );
}

export default Navbar;
