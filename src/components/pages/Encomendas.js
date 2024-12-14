import React, { useState, useEffect } from 'react';

const Encomendas = () => {
  const [encomendas, setEncomendas] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEncomendas = async () => {
      try {
        const response = await fetch('http://4.211.87.132:5000/api/encomendas/todas');
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

  return (
    <div className="encomendas">
      {error && <p>{error}</p>}
      <h2>Encomendas</h2>
      <ul>
        {encomendas.length > 0 ? (
          encomendas.map((encomenda, index) => (
            <li key={index}>
              <strong>Order ID:</strong> {encomenda.encomendaid} <br />
              <strong>Client Name:</strong> {encomenda.nomeproprio} {encomenda.ultimonome} <br />
              <strong>Order Date:</strong> {new Date(encomenda.dataencomenda).toLocaleDateString()} <br />
              <strong>Status:</strong> {encomenda.aprovadoporadministrador ? 'Approved' : 'Pending'} <br />
              <hr />
            </li>
          ))
        ) : (
          <p>No encomendas found.</p>
        )}
      </ul>
    </div>
  );
};

export default Encomendas;
