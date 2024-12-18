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
            {/* <div className="banner-container">
              <img
                src="/images/homebanner.jpg"
                alt="PillPoint Banner"
                className="banner-image"
              />
            </div> */}
            <div className="content-container">
              <div className="features-grid">
                <div className="feature-card">
                  <h2 className="feature-title">Medicamentos</h2>
                  <p className="feature-description">
                    NESTA CARTA APRESENTAR STOCK GLOBAL
                  </p>
                </div>
                <div className="feature-card">
                  <h2 className="feature-title">Alertas</h2>
                  <p className="feature-description">
                    NESTA CARTA APRESENTAR ALERTAS DE STOCK ABAIXO DO VALOR MINIMO
                  </p>
                </div>
                <div className="feature-card">
                  <h2 className="feature-title">Encomendas</h2>
                  <p className="feature-description">
                    NESTA CARTA APRESENTAR TODAS AS ENCOMENDAS POR CONFIRMAR
                  </p>
                </div>
                <div className="feature-card">
                  <h2 className="feature-title">Requisições</h2>
                  <p className="feature-description">
                    NESTA CARTA APRESENTAR TODAS AS REQUISIÇÕES POR CONFIRMAR
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