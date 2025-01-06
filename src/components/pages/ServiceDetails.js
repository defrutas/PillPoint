import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ServiceDetails.css'; // CSS for modern styling

const ServiceDetails = () => {
  const { id } = useParams(); // Extract the service ID from the URL
  const [service, setService] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://4.211.87.132:5000/api/services/servicessearch');
        if (!response.ok) {
          throw new Error('Failed to fetch services data');
        }
        const data = await response.json();

        // Filter the specific service by ID
        const selectedService = data.find((service) => service.servicoid === parseInt(id, 10));

        if (!selectedService) {
          setError('Service not found');
        } else {
          setService(selectedService);
        }
      } catch (err) {
        setError('Failed to load service details');
        console.error(err);
      }
    };

    fetchServices();
  }, [id]);

  if (error) {
    return (
      <div className="service-details-page">
        <h1>Detalhes</h1>
        <p className="error">{error}</p>
        <button onClick={() => navigate(-1)}>Voltar</button>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="service-details-page">
        <h1>A Carregar...</h1>
      </div>
    );
  }

  return (
    <div className="service-details-page">
      <h1>{service.descricao}</h1>
      <div className="service-details-card">
        <p>
          <strong>Localidade:</strong> {service.localidadeservico}
        </p>
        <p>
          <strong>Tipo ID:</strong> {service.tipoid}
        </p>
        <p>
          <strong>Disponível 24h:</strong> {service.servicodisponivel24horas ? 'Sim' : 'Não'}
        </p>
      </div>
      <button onClick={() => navigate(-1)}>Voltar</button>
    </div>
  );
};

export default ServiceDetails;
