import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import Toolbar from '../Toolbar'; // Toolbar component
import './Product.css'; // Import the CSS file

const Product = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [error, setError] = useState('');
  const [showPopUp, setShowPopUp] = useState(false);

  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    const fetchMedicamentos = async () => {
      try {
        const response = await fetch('http://4.211.87.132:5000/api/stock/inventory');
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

  const handleRestockClick = () => {
    setShowPopUp(true);
  };

  const handleClosePopUp = () => {
    setShowPopUp(false);
  };

  const handleCreateRequest = () => {
    navigate('/requests'); // Redirect to /requests page
  };

  const handleCreateOrder = () => {
    navigate('/encomendas'); // Redirect to /encomendas page
  };

  return (
    <div className="product-page">
      <Toolbar 
        name="Medicamentos"
        buttonLabel="Readquirir Stock"
        onButtonClick={handleRestockClick}
      />
      <div className="product-content">
        {error && <p>{error}</p>}
        {medicamentos.length > 0 ? (
          <div className="product-table-container">
            <div className="product-table-header">
              <div className="column">#</div>
              <div className="column">Nome</div>
              <div className="column">Descrição</div>
              <div className="column">Quantidade Disponível</div>
              <div className="column">Quantidade Mínima</div>
            </div>

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

      {showPopUp && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Opções de Reabastecimento</h3>
            <button onClick={handleCreateRequest}>Criar Requisição</button>
            <button onClick={handleCreateOrder}>Criar Encomenda</button>
            <button className="close-button" onClick={handleClosePopUp}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
