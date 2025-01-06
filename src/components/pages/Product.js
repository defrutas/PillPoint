import React, { useState, useEffect } from 'react';
import Toolbar from '../Toolbar'; // Toolbar component
import './Product.css'; // Import the CSS file

const Product = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [error, setError] = useState('');
  const [showPopUp, setShowPopUp] = useState(false);
  const [services, setServices] = useState([]);
  const [showServices, setShowServices] = useState(false);
  const [selectedService, setSelectedService] = useState(null); // New state for selected service

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
    setShowServices(false);
    setSelectedService(null); // Reset selected service when pop-up is closed
  };

  const handleCreateOrder = () => {
    console.log('Create a new order');
    setShowPopUp(false);
  };

  const handleViewServices = async () => {
    try {
      const response = await fetch('http://4.211.87.132:5000/api/services/servicessearch');
      if (!response.ok) {
        throw new Error('Failed to fetch services data');
      }
      const data = await response.json();
      setServices(data);
      setShowServices(true);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleServiceClick = (service) => {
    setSelectedService(service);
    console.log('Service clicked:', service);
    // You can display more details about the service or navigate to another page here
  };

  const handleDescricaoClick = (service) => {
    setSelectedService(service);
    console.log('Descrição clicked:', service);
    // You can display additional information or perform any other action
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
            <button onClick={handleCreateOrder}>Criar Nova Ordem</button>
            <button onClick={handleViewServices}>Ver Serviços Disponíveis</button>
            <button className="close-button" onClick={handleClosePopUp}>
              Fechar
            </button>
          </div>
        </div>
      )}

      {showServices && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Serviços Disponíveis</h3>
            <div className="service-table-container">
              <div className="product-table-header">
                <div className="column">Nome</div>
                <div className="column">Localidade</div>
                <div className="column">Disponível 24h</div>
              </div>
              {services.map((service) => (
                <div 
                  className="product-table-row" 
                  key={service.servicoid} 
                  onClick={() => handleServiceClick(service)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="column">{service.servicoid}</div>
                  <div className="column">{service.localidadeservico}</div>
                  <div 
                    className="column"
                    onClick={() => handleDescricaoClick(service)}
                    style={{ cursor: 'pointer', color: '#007bff' }}
                  >
                    {service.descricao}
                  </div>
                  <div className="column">{service.servicodisponivel24horas ? 'Sim' : 'Não'}</div>
                </div>
              ))}
            </div>
            <button className="close-button" onClick={handleClosePopUp}>
              Fechar
            </button>
          </div>
        </div>
      )}

      {selectedService && (
        <div className="service-detail-popup">
          <h3>Detalhes do Serviço</h3>
          <p><strong>Nome:</strong> {selectedService.descricao}</p>
          <p><strong>Localidade:</strong> {selectedService.localidadeservico}</p>
          <p><strong>Disponível 24h:</strong> {selectedService.servicodisponivel24horas ? 'Sim' : 'Não'}</p>
          <button onClick={() => setSelectedService(null)} className="close-button">
            Fechar
          </button>
        </div>
      )}
    </div>
  );
};

export default Product;
