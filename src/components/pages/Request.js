import React, { useState, useEffect } from 'react';
import Toolbar from '../Toolbar'; // Toolbar component

import './Encomenda.css';

const Request = () => {
  const [requisicoes, setRequisicoes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequisicoes = async () => {
      try {
        const allRequests = [];

        // Loop to fetch data from endpoints 1 to 10
        for (let i = 1; i <= 10; i++) {
          try {
            const response = await fetch(`http://4.211.87.132:5000/api/requisicoes/list/${i}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              mode: 'cors', // Explicitly set CORS mode
            });

            if (!response.ok) {
              throw new Error(`Failed to fetch data for service ID: ${i} - ${response.statusText}`);
            }

            const data = await response.json();
            allRequests.push(...data);  // Add fetched data to the array
          } catch (error) {
            console.error(error);
            setError(`Failed to load data for service ID: ${i}`);
          }
        }

        console.log('Fetched data:', allRequests);
        setRequisicoes(allRequests); // Set all the fetched data
      } catch (error) {
        setError('Failed to load requisicoes data');
        console.error(error);
      }
    };

    fetchRequisicoes();
  }, []);  // <- Correctly closed the useEffect hook here

  // Helper function to manually format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) {
      return 'Data Inválida'; // Return a default value for invalid dates
    }

    // Manually format the date to 'dd/mm/yyyy'
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`; // Return formatted date
  };

  return (
    <div className="requests-page">
      <Toolbar name="Requisicoes" />
      <div className="requests-content">
        {error && <p>{error}</p>} {/* Show error if any */}
        <h2>Lista de Requisições</h2>
        <ul>
          {requisicoes.length > 0 ? (
            requisicoes.map((requisicao, index) => (
              <li key={index}>
                <strong>ID da Requisição:</strong> {requisicao.requisicaoid} <br />
                <strong>Profissional:</strong> {requisicao.nomeproprio} {requisicao.ultimonome} <br />
                <strong>Data da Requisição:</strong> {formatDate(requisicao.datarequisicao)} <br />
                <strong>Aprovado por Administrador:</strong> {requisicao.aprovadoporadministrador ? 'Sim' : 'Não'} <br />
                <strong>Data de Entrega:</strong> {formatDate(requisicao.dataentrega)} <br />
                <hr />
              </li>
            ))
          ) : (
            <p>Não há requisições para exibir.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Request;
