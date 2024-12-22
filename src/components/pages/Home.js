import React, { useEffect, useState } from "react";
import "../../App.css";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import "./Home.css";
import { FaPills, FaBell, FaBox, FaClipboardList } from "react-icons/fa";

function Home() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [encomendas, setEncomendas] = useState([]);
  const [requisicoes, setRequisicoes] = useState([]);

  useEffect(() => {
    const baseURL = "http://4.211.87.132:5000";

    fetch(`${baseURL}/api/checkDatabase/check`)
      .then((response) => response.json())
      .then((data) => setMedicamentos(data))
      .catch((error) => console.error("Error fetching medicamentos:", error));

    fetch(`${baseURL}/api/checkDatabase/check`)
      .then((response) => response.json())
      .then((data) => setAlertas(data))
      .catch((error) => console.error("Error fetching alertas:", error));

    fetch(`${baseURL}/api/encomendas/pendentes-aprovacao`)
      .then((response) => response.json())
      .then((data) => setEncomendas(data))
      .catch((error) => console.error("Error fetching encomendas:", error));

    fetch(`${baseURL}/api/requisicoes/pendentes-aprovacao`)
      .then((response) => response.json())
      .then((data) => setRequisicoes(data))
      .catch((error) => console.error("Error fetching requisicoes:", error));
  }, []);

  const handleCardClick = (path) => {
    // Placeholder function to navigate
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
                {medicamentos.length > 0
                  ? `${medicamentos.length} Medicamentos disponíveis`
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
                {alertas.length > 0
                  ? `${alertas.length} Alertas por resolver!`
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
                {encomendas.length > 0
                  ? `${encomendas.length} Encomendas pendentes`
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
                {requisicoes.length > 0
                  ? `${requisicoes.length} Requisições pendentes`
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
