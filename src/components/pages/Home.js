import React, { useEffect, useState } from 'react';
import '../../App.css';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import './Home.css';

function Home() {
  // State for storing data
  const [medicamentos, setMedicamentos] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [encomendas, setEncomendas] = useState([]);
  const [requisicoes, setRequisicoes] = useState([]);

  // Fetch data from backend when component mounts
  useEffect(() => {
    // Fetch Medicamentos (Stock Global) data
    fetch('/api/medicamentos') // Replace with correct API endpoint for medicamentos
      .then(response => response.json())
      .then(data => setMedicamentos(data))
      .catch(error => console.error('Error fetching medicamentos:', error));

    // Fetch Alertas (Stock Alerts) data
    fetch('/api/alertas') // This should match the backend route where `checkDatabase` is defined
      .then(response => response.json())
      .then(data => setAlertas(data))
      .catch(error => console.error('Error fetching alertas:', error));

    // Fetch Encomendas (Orders Pending Approval) data
    fetch('/api/encomendas/pendentes-aprovacao') // Adjust to the correct endpoint for orders
      .then(response => response.json())
      .then(data => setEncomendas(data))
      .catch(error => console.error('Error fetching encomendas:', error));

    // Fetch Requisições (Requests Pending Approval) data
    fetch('/api/requisicoes/pendentes-aprovacao') // Adjust to the correct endpoint for requests
      .then(response => response.json())
      .then(data => setRequisicoes(data))
      .catch(error => console.error('Error fetching requisicoes:', error));
  }, []); // Empty dependency array ensures this runs once after the component mounts

  return (
    <div className="homepage-container">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 ml-48">
          <div className="content-container">
            <div className="features-grid">
              {/* Medicamentos feature */}
              <div className="feature-card">
                <h2 className="feature-title">Medicamentos</h2>
                <p className="feature-description">
                  {medicamentos.length > 0
                    ? `Stock global de medicamentos: ${medicamentos.length} itens`
                    : 'Nenhum medicamento encontrado.'}
                </p>
              </div>

              {/* Alertas feature */}
              <div className="feature-card">
                <h2 className="feature-title">Alertas</h2>
                <p className="feature-description">
                  {alertas.length > 0
                    ? `Alertas de stock abaixo do mínimo: ${alertas.length} alertas`
                    : 'Nenhum alerta de stock abaixo do valor mínimo.'}
                </p>
              </div>

              {/* Encomendas feature */}
              <div className="feature-card">
                <h2 className="feature-title">Encomendas</h2>
                <p className="feature-description">
                  {encomendas.length > 0
                    ? `Encomendas pendentes de aprovação: ${encomendas.length} encomendas`
                    : 'Nenhuma encomenda pendente de aprovação.'}
                </p>
              </div>

              {/* Requisições feature */}
              <div className="feature-card">
                <h2 className="feature-title">Requisições</h2>
                <p className="feature-description">
                  {requisicoes.length > 0
                    ? `Requisições pendentes de aprovação: ${requisicoes.length} requisições`
                    : 'Nenhuma requisição pendente de aprovação.'}
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
