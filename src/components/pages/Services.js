import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Toolbar from "../Toolbar"; // Toolbar component
import "./Services.css"; // Import the CSS file for services styling

const Services = () => {
  const [services, setServices] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newService, setNewService] = useState({
    localidadeServico: "",
    tipoID: "",
    novoTipoServico: {
      descricao: "",
      servicoDisponivel24horas: false,
    },
  });
  const [createNewTipo, setCreateNewTipo] = useState(false);
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

    const fetchTipos = async () => {
      try {
        const response = await fetch(
          "http://4.211.87.132:5000/api/services/tiposervicos"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch tipos");
        }
        const data = await response.json();
        setTipos(data);
      } catch (error) {
        setError("Failed to load tipos data");
        console.error(error);
      }
    };

    fetchServices();
    fetchTipos();
  }, []);

  const handleNewServiceClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCreateNewTipo(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (createNewTipo && name.startsWith("novoTipoServico.")) {
      const field = name.split(".")[1];
      setNewService((prevState) => ({
        ...prevState,
        novoTipoServico: {
          ...prevState.novoTipoServico,
          [field]:
            field === "servicoDisponivel24horas" ? value === "true" : value,
        },
      }));
    } else {
      setNewService((prevState) => ({
        ...prevState,
        [name]: value, // Ensure correct state update for localidadeServico and other fields
      }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      localidadeServico: newService.localidadeServico,
      tipoID: createNewTipo ? undefined : parseInt(newService.tipoID, 10),
      novoTipoServico: createNewTipo ? newService.novoTipoServico : undefined,
    };

    try {
      const response = await fetch(
        "http://4.211.87.132:5000/api/services/servico-completo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setServices((prevState) => [...prevState, data]);
        setIsModalOpen(false);
        setNewService({
          localidadeServico: "",
          tipoID: "",
          novoTipoServico: {
            descricao: "",
            servicoDisponivel24horas: false,
          },
        });
        setCreateNewTipo(false);
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
            {services.map((service) => (
              <div className="services-table-row" key={service.servicoID}>
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

              {!createNewTipo ? (
                <div className="form-group">
                  <label htmlFor="tipoID">Tipo de Serviço</label>
                  <select
                    name="tipoID"
                    id="tipoID"
                    value={newService.tipoID}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione um Tipo</option>
                    {tipos.map((tipo) => (
                      <option key={tipo.tipoID} value={tipo.tipoID}>
                        {tipo.descricao}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label htmlFor="novoTipoServico.descricao">Descrição</label>
                    <input
                      type="text"
                      name="novoTipoServico.descricao"
                      id="novoTipoServico.descricao"
                      placeholder="Descrição do Tipo"
                      value={newService.novoTipoServico.descricao}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="novoTipoServico.servicoDisponivel24horas">
                      Disponível 24h
                    </label>
                    <select
                      name="novoTipoServico.servicoDisponivel24horas"
                      id="novoTipoServico.servicoDisponivel24horas"
                      value={newService.novoTipoServico.servicoDisponivel24horas}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="true">Sim</option>
                      <option value="false">Não</option>
                    </select>
                  </div>
                </>
              )}

              <div className="form-group">
                <button
                  type="button"
                  onClick={() => setCreateNewTipo(!createNewTipo)}
                >
                  {createNewTipo
                    ? "Selecionar Tipo Existente"
                    : "Criar Novo Tipo"}
                </button>
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
