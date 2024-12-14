import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './components/pages/Login';
import Home from './components/pages/Home';
import Product from './components/pages/Product';
import AdminTesting from './components/pages/TESTING'; // Ensure this import is there

function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

function MainContent() {
  const location = useLocation();
  const hideNavAndSidebar = location.pathname === '/';

  return (
    <>
      {!hideNavAndSidebar && <Navbar />}
      {!hideNavAndSidebar && <Sidebar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/TESTING" element={<AdminTesting />} /> {/* Add this route for AdminTesting */}
      </Routes>
    </>
  );
}

export default App;
