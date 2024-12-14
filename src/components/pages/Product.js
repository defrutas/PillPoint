import React, { useState, useEffect } from 'react';
// import Toolbar from '../Toolbar';  // Commenting out the Toolbar import

import './Product.css';  // Import the CSS file

const Product = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch data when the component mounts
    const fetchMedicamentos = async () => {
      try {
        const response = await fetch('http://4.211.87.132:5000/api/checkDatabase/check');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setMedicamentos(data);
      } catch (error) {
        setError('Failed to load medicamentos data');
        console.error(error);
      }
    };

    fetchMedicamentos();
  }, []); // Empty dependency array to run this effect only once, when the component mounts

  return (
    <div className="product-page">
      {/* Remove the <Toolbar /> reference completely */}
      <div className="content">
        {error && <p>{error}</p>} {/* Show error if any */}
        <h2>Medicamentos Abaixo da Quantidade Mínima</h2>
        <ul>
          {medicamentos.length > 0 ? (
            medicamentos.map((medicamento, index) => (
              <li key={index}>
                <strong>Nome:</strong> {medicamento.nomemedicamento} <br />
                <strong>Descrição:</strong> {medicamento.descricao} <br />
                <strong>Quantidade Disponível:</strong> {medicamento.quantidadedisponivel} <br />
                <strong>Quantidade Mínima:</strong> {medicamento.quantidademinima} <br />
                <hr />
              </li>
            ))
          ) : (
            <p>Não há medicamentos abaixo da quantidade mínima.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Product;
