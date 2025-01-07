import React, { useState, useEffect } from 'react';
import Toolbar from '../Toolbar';
import './Encomendas.css';

const Encomendas = () => {
  const [encomendas, setEncomendas] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEncomendas = async () => {
      try {
        const response = await fetch('http://4.211.87.132:5000/api/orders/all');
        if (!response.ok) {
          throw new Error('Failed to fetch encomendas');
        }
        const data = await response.json();
        setEncomendas(data);
      } catch (error) {
        setError('Failed to load encomendas data');
        console.error(error);
      }
    };
    fetchEncomendas();
  }, []);

  const getStatusClass = (status) => {
    if (status === 'Approved') return 'status-approved';
    if (status === 'Pending') return 'status-pending';
    if (status === 'Refused') return 'status-refused';
    return '';
  };

  return (
    <div className="encomendas-page">
      <Toolbar 
        name="Encomendas"
        buttonLabel="Nova Encomenda"
        onButtonClick={() => console.log('Create a new encomenda')} 
      />
      <div className="encomendas-content">
        {error && <p>{error}</p>}
        {encomendas.length > 0 ? (
          <div className="encomendas-table-container">
            {/* Table Header */}
            <div className="encomendas-table-header">
              <div className="column-id">#</div>
              <div className="column-client">Criado por</div>
              <div className="column-supplier">Fornecedor</div>
              <div className="column-date">Data de Envio</div>
              <div className="column-quantity">Quantidade Encomendada</div>
              {/* <div className="column-complete">Complete</div>
              <div className="column-admin">Approvado?</div> */}
              <div className="column-delivery-date">Data de Entrega</div>
              <div className="column-status">Estado</div>
            </div>

            {/* Table Rows */}
            {encomendas.map((encomenda, index) => (
              <div className="encomendas-table-row" key={index}>
                <div className="column-id">{encomenda.encomendaid}</div>
                <div className="column-client">
                  {encomenda.nomeproprio} {encomenda.ultimonome}
                </div>
                <div className="column-supplier">{encomenda.nomefornecedor}</div>
                <div className="column-date">
                  {new Date(encomenda.dataencomenda).toLocaleDateString()}
                </div>
                <div className="column-quantity">{encomenda.quantidadeenviada}</div>
                {/* <div className="column-complete">
                  {encomenda.encomendacompleta ? 'Yes' : 'No'}
                </div> */}
                {/* <div className="column-admin">
                  {encomenda.aprovadoporadministrador === null
                    ? 'Pending'
                    : encomenda.aprovadoporadministrador
                    ? 'Yes'
                    : 'No'}
                </div> */}
                <div className="column-delivery-date">
                  {encomenda.dataentrega
                    ? new Date(encomenda.dataentrega).toLocaleDateString()
                    : 'N/A'}
                </div>
                <div
                  className={`column-status ${getStatusClass(
                    encomenda.status || (encomenda.aprovadoporadministrador ? 'Approved' : 'Pending')
                  )}`}
                >
                  {encomenda.status || (encomenda.aprovadoporadministrador ? 'Approved' : 'Pending')}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No encomendas found.</p>
        )}
      </div>
    </div>
  );
};

export default Encomendas;
