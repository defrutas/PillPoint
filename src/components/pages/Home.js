import React, { useEffect, useState } from "react"; 
import "../../App.css";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import "./Home.css";
import { FaPills, FaBell, FaBox, FaClipboardList } from "react-icons/fa";

function Home() {
  const [counts, setCounts] = useState({
    medicamentos: 0,
    alertas: 0,
    encomendas: 0,
    requisicoes: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch("http://4.211.87.132:5000/api/notifications");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();

        // Helper function to extract the number from a string
        const extractNumberFromString = (str) => {
          const match = str.match(/\d+/);  // Extracts the first number in a string
          return match ? parseInt(match[0], 10) : 0;
        };

        setCounts({
          medicamentos: typeof data.medications === 'string' 
            ? extractNumberFromString(data.medications)
            : (Array.isArray(data.medications) ? data.medications.length : 0),
          
          alertas: (
            (typeof data.medications === 'string' ? extractNumberFromString(data.medications) : (Array.isArray(data.medications) ? data.medications.length : 0)) +
            (typeof data.orders === 'string' ? extractNumberFromString(data.orders) : (Array.isArray(data.orders) ? data.orders.length : 0)) +
            (typeof data.requests === 'string' ? extractNumberFromString(data.requests) : (Array.isArray(data.requests) ? data.requests.length : 0))
          ),
          
          encomendas: typeof data.orders === 'string' 
            ? extractNumberFromString(data.orders) 
            : (Array.isArray(data.orders) ? data.orders.length : 0),

          requisicoes: typeof data.requests === 'string' 
            ? extractNumberFromString(data.requests)
            : (Array.isArray(data.requests) ? data.requests.length : 0),
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  const handleCardClick = (path) => {
    window.location.href = path;
  };

  return (
    <div className="home-container">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <main className="content">
          <div className="card-container">
            {/* Medicamentos Card */}
            <div
              className="card medicamentos"
              onClick={() => handleCardClick("/product")}
            >
              <FaPills className="card-icon" />
              <h2 className="card-title">Medicamentos</h2>
              <p className="card-description">
                {counts.medicamentos > 0
                  ? `${counts.medicamentos} Medicamentos disponíveis`
                  : "Nenhum medicamento encontrado."}
              </p>
            </div>

            {/* Alertas Card */}
            <div
              className="card alertas"
              onClick={() => handleCardClick("/alerts")}
            >
              <FaBell className="card-icon" />
              <h2 className="card-title">Alertas</h2>
              <p className="card-description">
                {counts.alertas > 0
                  ? `${counts.alertas} Alertas por resolver!`
                  : "Nenhum alerta de stock abaixo do valor mínimo."}
              </p>
            </div>

            {/* Encomendas Card */}
            <div
              className="card encomendas"
              onClick={() => handleCardClick("/encomendas")}
            >
              <FaBox className="card-icon" />
              <h2 className="card-title">Encomendas</h2>
              <p className="card-description">
                {counts.encomendas > 0
                  ? `${counts.encomendas} Encomendas pendentes`
                  : "Nenhuma encomenda pendente de aprovação."}
              </p>
            </div>

            {/* Requisições Card */}
            <div
              className="card requisicoes"
              onClick={() => handleCardClick("/requests")}
            >
              <FaClipboardList className="card-icon" />
              <h2 className="card-title">Requisições</h2>
              <p className="card-description">
                {counts.requisicoes > 0
                  ? `${counts.requisicoes} Requisições pendentes`
                  : "Nenhuma requisição pendente de aprovação."}
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Home;
