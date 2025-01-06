import React, { useState, useEffect } from 'react';
import Toolbar from '../Toolbar'; // Toolbar component
import './Request.css';

const Request = () => {
  const [requisicoes, setRequisicoes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequisicoes = async () => {
      try {
        const allRequests = [];

        for (let i = 1; i <= 10; i++) {
          try {
            const response = await fetch(`http://4.211.87.132:5000/api/requisitions/list/${i}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              mode: 'cors',
            });

            if (!response.ok) {
              throw new Error(`Failed to fetch data for service ID: ${i} - ${response.statusText}`);
            }

            const data = await response.json();
            allRequests.push(...data);
          } catch (error) {
            console.error(error);
            setError(`Failed to load data for service ID: ${i}`);
          }
        }

        setRequisicoes(allRequests);
      } catch (error) {
        setError('Failed to load requisicoes data');
        console.error(error);
      }
    };

    fetchRequisicoes();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) {
      return 'Data Inválida';
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <div className="requests-page">
      <Toolbar name="Requisições" />
      <div className="requests-content">
        {error && <p>{error}</p>}
        {requisicoes.length > 0 ? (
          <div className="requests-table-container">
            {/* Table Header */}
            <div className="requests-table-header">
              <div className="column">#</div>
              <div className="column">Profissional</div>
              <div className="column">Data da Requisição</div>
              <div className="column">Aprovado</div>
              <div className="column">Data de Entrega</div>
            </div>

            {/* Table Rows */}
            {requisicoes.map((requisicao, index) => (
              <div className="requests-table-row" key={index}>
                <div className="column">{requisicao.requisicaoid}</div>
                <div className="column">
                  {requisicao.nomeproprio} {requisicao.ultimonome}
                </div>
                <div className="column">{formatDate(requisicao.datarequisicao)}</div>
                <div className="column">{requisicao.aprovadoporadministrador ? 'Sim' : 'Não'}</div>
                <div className="column">{formatDate(requisicao.dataentrega)}</div>
              </div>
            ))}
          </div>
        ) : (
          <p>Não há requisições para exibir.</p>
        )}
      </div>
    </div>
  );
};

export default Request;
