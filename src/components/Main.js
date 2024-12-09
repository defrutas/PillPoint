import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import './Main.css'; // Import the CSS for HomePage

const Main = () => {
  return (
    <div className="homepage-container">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 ml-48">
          <div className="banner-container">
            <img
              src="/images/homebanner.jpg"
              alt="PillPoint Banner"
              className="banner-image"
            />
          </div>
          <div className="content-container">
            <h1 className="title">PillPoint</h1>
            <p className="description">
              PillPoint is a cutting-edge medicine distribution app designed to revolutionize how pharmacies track and manage their inventory across different services. With PillPoint, you can effortlessly monitor stock levels, receive timely alerts for low inventory, and efficiently manage requests for specific medicines.
            </p>
            <div className="features-grid">
              <div className="feature-card">
                <h2 className="feature-title">Inventory Tracking</h2>
                <p className="feature-description">
                  Keep your stock levels under control with our advanced tracking system.
                </p>
              </div>
              <div className="feature-card">
                <h2 className="feature-title">Smart Alerts</h2>
                <p className="feature-description">
                  Receive intelligent notifications when your inventory needs attention.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Main;
