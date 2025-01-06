import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Toolbar from '../Toolbar'; // Toolbar component
import './Services.css'; // Import the CSS file for services styling

const Services = () => {
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://4.211.87.132:5000/api/services/servicessearch');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setServices(data);
      } catch (error) {
        setError('Failed to load services data');
        console.error(error);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="services-page">
      <Toolbar name="Servicos" />
      <div className="services-content">
        {error && <p>{error}</p>}
        {services.length > 0 ? (
          <div className="services-table-container">
            {/* Table Header */}
            <div className="services-table-header">
              <div className="column">#</div>
              <div className="column">Nome</div>
              <div className="column">Localidade</div>
              <div className="column">Disponível 24h</div>
            </div>

            {/* Table Rows */}
            {services.map((service, index) => (
              <div className="services-table-row" key={index}>
                <div className="column">{service.servicoid}</div>
                <div className="column">
                  <Link to={`/services/${service.servicoid}`} className="service-link">
                    {service.descricao}
                  </Link>
                </div>
                <div className="column">{service.localidadeservico}</div>
                <div className="column">
                  {service.servicodisponivel24horas ? 'Sim' : 'Não'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Não há serviços disponíveis no momento.</p>
        )}
      </div>
    </div>
  );
};

export default Services;
