import React, { useState, useEffect } from 'react';
import Toolbar from '../Toolbar'; // Toolbar component
import './Product.css'; // Import the CSS file

const Product = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
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
  }, []);

  return (
    <div className="product-page">
      <Toolbar name="Medicamentos" />
      <div className="product-content">
        {error && <p>{error}</p>}
        {medicamentos.length > 0 ? (
          <div className="product-table-container">
            {/* Table Header */}
            <div className="product-table-header">
              <div className="column">#</div>
              <div className="column">Nome</div>
              <div className="column">Descrição</div>
              <div className="column">Quantidade Disponível</div>
              <div className="column">Quantidade Mínima</div>
            </div>

            {/* Table Rows */}
            {medicamentos.map((medicamento, index) => (
              <div className="product-table-row" key={index}>
                <div className="column">{medicamento.medicamentoid}</div>
                <div className="column">{medicamento.nomemedicamento}</div>
                <div className="column">{medicamento.descricao}</div>
                <div className="column">{medicamento.quantidadedisponivel}</div>
                <div className="column">{medicamento.quantidademinima}</div>
              </div>
            ))}
          </div>
        ) : (
          <p>Não há medicamentos abaixo da quantidade mínima.</p>
        )}
      </div>
    </div>
  );
};

export default Product;
