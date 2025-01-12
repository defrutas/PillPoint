import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ServiceDetails.css";

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Hook for navigation
  const [service, setService] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServiceAndMedicines = async () => {
      try {
        const response = await fetch(
          `http://4.211.87.132:5000/api/services/showstock/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch service details and stock");
        }
        const data = await response.json();
        const { service, stock } = data;
        setService(service);
        setMedicines(stock);
      } catch (err) {
        setError(err.message || "Could not fetch service details");
        console.error(err);
      }
    };

    fetchServiceAndMedicines();
  }, [id]);

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!service) {
    return <p>Loading...</p>;
  }

  return (
    <div className="service-details-container mt-20 px-4 py-8">
      <div className="service-info">
        <h1 className="service-title">{service.nomeServico}</h1>
        <div className="service-details">
          <p> {service.descServico} </p>
          <p>
            <strong>Localização:</strong> {service.localidadeServico}
          </p>
          {service.servicoDisponivel24horas && (
            <p>
              <strong>Disponibilidade:</strong> Aberto 24h por dia
            </p>
          )}
        </div>

        <h2 className="medicines-header">
          Medicação disponível em {service.nomeServico}
        </h2>
        {medicines.length > 0 ? (
          <div className="medicines-list">
            {medicines.map((med) => (
              <div
                key={med.medicamentoID}
                className={`medicine-card ${
                  med.quantidadeDisponivel < med.quantidadeMinima
                    ? "low-stock-visible"
                    : ""
                }`}
              >
                <h3 className="medicine-title">{med.nomeMedicamento}</h3>
                <div className="medicine-info">
                  <p>
                    <strong>Quantidade Disponível:</strong>{" "}
                    {med.quantidadeDisponivel}
                  </p>
                  <p>
                    <strong>Quantidade Minima:</strong>{" "}
                    {med.quantidadeMinima}
                  </p>
                  <span className="low-stock">
                    Atenção!! Quantidade Minima Ultrapassada
                  </span>
                </div>
                {med.quantidadeDisponivel < med.quantidadeMinima && (
                  <div className="medicine-actions">
                    <button
                      className="action-button"
                      onClick={() => (window.location.href = "/requests")}
                    >
                      Fazer Requisição
                    </button>
                    <button
                      className="action-button"
                      onClick={() => (window.location.href = "/encomendas")}
                    >
                      Fazer Encomenda
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No medicines available for this service.</p>
        )}
      </div>

      {/* Back to Services Button */}
      <div className="back-button-container">
        <button
          className="back-button"
          onClick={() => navigate("/services")}
        >
          Voltar para Serviços
        </button>
      </div>
    </div>
  );
};

export default ServiceDetails;
