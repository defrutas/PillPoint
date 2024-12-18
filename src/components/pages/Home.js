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
    const baseURL = 'http://4.211.87.132:5000'; // Backend IP address

    // Fetch Medicamentos (Stock Global) data
    fetch(`${baseURL}/api/medicamentos`)
      .then(response => {
        if (!response.ok) {
          // If the response is not OK (e.g., 404 or 500 error), throw an error
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => setMedicamentos(data))
      .catch(error => {
        console.error('Error fetching medicamentos:', error);
        // Handle the error gracefully (e.g., show a message to the user)
      });

    // Fetch Alertas (Stock Alerts) data
    fetch(`${baseURL}/api/alertas`)
      .then(response => response.json())
      .then(data => setAlertas(data))
      .catch(error => console.error('Error fetching alertas:', error));

    // Fetch Encomendas (Orders Pending Approval) data
    fetch(`${baseURL}/api/encomendas/pendentes-aprovacao`)
      .then(response => response.json())
      .then(data => setEncomendas(data))
      .catch(error => console.error('Error fetching encomendas:', error));

    // Fetch Requisições (Requests Pending Approval) data
    fetch(`${baseURL}/api/requisicoes/pendentes-aprovacao`)
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
