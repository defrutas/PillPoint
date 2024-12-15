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
      <div className="content">
        {error && <p>{error}</p>}

        {medicamentos.length > 0 ? (
          <div className="table-container">
            {/* Table Header */}
            <div className="table-header">
              <div className="column-id">#</div>
              <div className="column-name">Nome</div>
              <div className="column-description">Descrição</div>
              <div className="column-available">Quantidade Disponível</div>
              <div className="column-minimum">Quantidade Mínima</div>
            </div>

            {/* Table Rows */}
            {medicamentos.map((medicamento, index) => (
              <div className="table-row" key={index}>
                <div className="column-id">{medicamento.medicamentoid}</div>
                <div className="column-name">{medicamento.nomemedicamento}</div>
                <div className="column-description">{medicamento.descricao}</div>
                <div className="column-available">{medicamento.quantidadedisponivel}</div>
                <div className="column-minimum">{medicamento.quantidademinima}</div>
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
