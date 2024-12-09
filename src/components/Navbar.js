import React from 'react';
import { User } from 'lucide-react'; // Ensure lucide-react is installed for icons
import './Navbar.css';  // Assuming it's in the same directory


function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">PillPoint</div>
      <div className="user-info">
        <User className="user-icon" />
        <span className="user-name">John Doe</span>
      </div>
    </nav>
  );
}

export default Navbar;
