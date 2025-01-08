import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Toolbar from "../Toolbar";
import "./Services.css";

const Services = () => {
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [newService, setNewService] = useState({
    localidadeServico: "",
    nomeServico: "",
    descServico: "",
    servicoDisponivel24horas: false,
  });
  const [loading, setLoading] = useState(false);

  // Fetch all services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("http://4.211.87.132:5000/api/services/all");
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

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewService((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle "Add New Service" button click
  const handleNewServiceClick = () => {
    setNewService({
      localidadeServico: "",
      nomeServico: "",
      descServico: "",
      servicoDisponivel24horas: false,
    });
    setEditingService(null); // Reset editingService for new service
    setIsModalOpen(true);
  };

  // Handle "Edit" button click
  const handleEditClick = (service) => {
    setEditingService(service);
    setNewService(service);
    setIsModalOpen(true);
  };

  // Handle form modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError("");
  };

  // Handle form submission for Add/Edit service
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      localidadeServico: newService.localidadeServico,
      nomeServico: newService.nomeServico,
      descServico: newService.descServico,
      servicoDisponivel24horas: newService.servicoDisponivel24horas,
    };

    try {
      const endpoint = editingService
        ? `http://4.211.87.132:5000/api/services/servico/${editingService.servicoID}`
        : "http://4.211.87.132:5000/api/services/add";
      const method = editingService ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const updatedService = await response.json();
        setServices((prevState) =>
          editingService
            ? prevState.map((service) =>
                service.servicoID === updatedService.servicoID
                  ? updatedService
                  : service
              )
            : [...prevState, updatedService]
        );
        setIsModalOpen(false);
      } else {
        setError("Failed to save service");
      }
    } catch (error) {
      setError("Error submitting form");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle service deletion
  const handleDeleteClick = async (id) => {
    try {
      const response = await fetch(
        `http://4.211.87.132:5000/api/services/servico/${id}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        setServices((prevState) =>
          prevState.filter((service) => service.servicoID !== id)
        );
      } else {
        setError("Failed to delete service");
      }
    } catch (error) {
      setError("Error deleting service");
      console.error(error);
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
              <div className="column">Ações</div>
            </div>
            {services.map((service) => (
              <div className="services-table-row" key={service.servicoID}>
                <div className="column">{service.servicoID}</div>
                <div className="column">
                  <Link
                    to={`/services/${service.servicoID}`}
                    className="service-link"
                  >
                    {service.nomeServico}
                  </Link>
                </div>
                <div className="column">{service.localidadeServico}</div>
                <div className="column">
                  {service.servicoDisponivel24horas ? "Sim" : "Não"}
                </div>
                <div className="column">
                  <button
                    className="edit-btn"
                    onClick={() => handleEditClick(service)}
                  >
                    Editar
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteClick(service.servicoID)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Não há serviços disponíveis no momento.</p>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-services">
          <div className="modal-content-services">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <form onSubmit={handleFormSubmit}>
              <label>
                Nome:
                <input
                  type="text"
                  name="nomeServico"
                  value={newService.nomeServico}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Localidade:
                <input
                  type="text"
                  name="localidadeServico"
                  value={newService.localidadeServico}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Descrição:
                <textarea
                  name="descServico"
                  value={newService.descServico}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Disponível 24h:
                <input
                  type="checkbox"
                  name="servicoDisponivel24horas"
                  checked={newService.servicoDisponivel24horas}
                  onChange={handleInputChange}
                />
              </label>
              <button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Salvar"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
