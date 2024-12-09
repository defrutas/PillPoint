import React from 'react';
import { Link } from 'react-router-dom'; // Using react-router-dom for routing
import './Sidebar.css'; // Import the CSS for the sidebar

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to="/" className="sidebar-link">
        Home
      </Link>
      <Link to="/products" className="sidebar-link">
        Products
      </Link>
      <Link to="/requests" className="sidebar-link">
        Requests
      </Link>
    </div>
  );
};

export default Sidebar;
