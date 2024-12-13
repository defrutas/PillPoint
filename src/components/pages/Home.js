import React from 'react';
import '../../App.css';

import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import './Home.css'

function Home(){
    return(
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
}

export default Home;