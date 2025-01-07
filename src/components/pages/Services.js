import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Toolbar from "../Toolbar"; // Toolbar component
import "./Services.css"; // Import the CSS file for services styling

const Services = () => {
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newService, setNewService] = useState({
    descricao: "",
    servicoDisponivel24horas: false,
    localidadeServico: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(
          "http://4.211.87.132:5000/api/services/servicessearch"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setServices(data);
      } catch (error) {
        setError("Failed to load services data");
        console.error(error);
      }
    };

    fetchServices();
  }, []);

  const handleNewServiceClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewService((prevState) => ({
      ...prevState,
      [name]:
        name === "servicoDisponivel24horas" ? value === "true" : value, // Convert to boolean
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        "http://4.211.87.132:5000/api/services/servico",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newService),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setServices((prevState) => [...prevState, data]);
        setIsModalOpen(false);
        setNewService({
          descricao: "",
          servicoDisponivel24horas: false,
          localidadeServico: "",
        });
      } else {
        setError("Failed to create new service");
      }
    } catch (error) {
      setError("Error submitting form");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="services-page">
      <Toolbar
        name="Serviços"
        buttonLabel="Adicionar Novo Serviço"
        onButtonClick={handleNewServiceClick}
      />
      <div className="services-content">
        {error && <p className="error">{error}</p>}
        {services.length > 0 ? (
          <div className="services-table-container">
            <div className="services-table-header">
              <div className="column">#</div>
              <div className="column">Nome</div>
              <div className="column">Localidade</div>
              <div className="column">Disponível 24h</div>
            </div>
            {services.map((service, index) => (
              <div className="services-table-row" key={index}>
                <div className="column">{service.servicoID}</div>
                <div className="column">
                  <Link
                    to={`/services/${service.servicoID}`}
                    className="service-link"
                  >
                    {service.descricao}
                  </Link>
                </div>
                <div className="column">{service.localidadeServico}</div>
                <div className="column">
                  {service.servicoDisponivel24horas ? "Sim" : "Não"}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Não há serviços disponíveis no momento.</p>
        )}
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="descricao">Descrição</label>
                <input
                  type="text"
                  name="descricao"
                  id="descricao"
                  placeholder="Descrição do Serviço"
                  value={newService.descricao}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="servicoDisponivel24horas">Disponível 24h</label>
                <select
                  name="servicoDisponivel24horas"
                  id="servicoDisponivel24horas"
                  value={newService.servicoDisponivel24horas}
                  onChange={handleInputChange}
                  required
                >
                  <option value="true">Sim</option>
                  <option value="false">Não</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="localidadeServico">Localidade</label>
                <input
                  type="text"
                  name="localidadeServico"
                  id="localidadeServico"
                  placeholder="Localidade do Serviço"
                  value={newService.localidadeServico}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Salvar"}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCloseModal}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
