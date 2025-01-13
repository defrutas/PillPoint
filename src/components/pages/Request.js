import React, { useState, useEffect } from "react";
import "./Request.css";
import Toolbar from "../Toolbar";

const ESTADO_MAP = {
  1: "Pendente",
  2: "Cancelado",
  3: "Aguardar Envio",
  4: "Concluído",
};

const Request = () => {
  const [requisicoes, setRequisicoes] = useState([]);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [services, setServices] = useState({});
  const [newRequest, setNewRequest] = useState({
    dataRequisicao: new Date().toISOString().split("T")[0],
    dataEntrega: "",
    estadoID: 1,
    adminID: null,
    aprovadoPorAdministrador: 0,
    requisicaoCompleta: 0,
    medicamentos: [{ medicamentoID: "", quantidade: 0 }],
    servicoID: "",
  });

  const getEstadoClass = (estadoID) => {
    switch (estadoID) {
      case 1: // Pendente
        return "estado-pendente";
      case 2: // Cancelado
        return "estado-cancelado";
      case 3: // Aguardar Envio
        return "estado-aguardar-envio";
      case 4: // Concluído
        return "estado-concluido";
      default:
        return "";
    }
  };

  const [medicamentosList, setMedicamentosList] = useState([]);
  const [servicosList, setServicosList] = useState([]);
  const [availableServicos, setAvailableServicos] = useState([]);

  useEffect(() => {
    const fetchRequisicoes = async () => {
      try {
        const response = await fetch(
          "http://4.211.87.132:5000/api/requests/all"
        );
        if (!response.ok) throw new Error("Failed to fetch requisicoes");
        const data = await response.json();
        setRequisicoes(data);
      } catch (err) {
        setError("Failed to load requisicoes data.");
      }
    };

    const fetchMedicamentos = async () => {
      try {
        const response = await fetch(
          "http://4.211.87.132:5000/api/products/all"
        );
        if (!response.ok) throw new Error("Failed to fetch medicamentos");
        const data = await response.json();
        setMedicamentosList(data);
      } catch (err) {
        setError("Failed to load medicamentos data.");
      }
    };

    const fetchServicos = async () => {
      try {
        const response = await fetch(
          "http://4.211.87.132:5000/api/services/all"
        );
        if (!response.ok)
          throw new Error("Failed to fetch serviços hospitalares");
        const data = await response.json();

        // Map the services list to a key-value pair with servicoID as the key
        const servicesMap = data.reduce((acc, servico) => {
          acc[servico.servicoID] = servico.nomeServico;
          return acc;
        }, {});

        setServicosList(data.map((servico) => servico.nomeServico));
        setServices(servicesMap); // Update the services state
      } catch (err) {
        setError("Failed to load serviços hospitalares.");
      }
    };

    fetchRequisicoes();
    fetchMedicamentos();
    fetchServicos();
  }, []);

  // Fetch available services when medicamento is selected
  useEffect(() => {
    const fetchAvailableServicos = async () => {
      try {
        const medicamentoID = newRequest.medicamentos[0]?.medicamentoID;
        if (!medicamentoID) return; // Avoid fetching if medicamentoID is missing

        const response = await fetch(
          `http://4.211.87.132:5000/api/requests/${medicamentoID}/servicos`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch available services for this medicamento"
          );
        }

        const data = await response.json();
        setAvailableServicos(data); // Update available services
      } catch (err) {
        setError("Failed to load available services.");
      }
    };

    fetchAvailableServicos();
  }, [newRequest.medicamentos[0]?.medicamentoID]);

  // Handle Concluir button click (sets state to "Concluido")
  const handleConcluir = async (requisicaoID) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token available.");

      const response = await fetch(
        `http://4.211.87.132:5000/api/requests/complete/${requisicaoID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to complete the request");
      }

      const updatedRequisicoes = requisicoes.map((req) =>
        req.requisicaoID === requisicaoID
          ? { ...req, estadoID: 4 } // Set state to "Concluido"
          : req
      );

      setRequisicoes(updatedRequisicoes);
    } catch (error) {
      console.error("Error completing request:", error);
      setError("Failed to complete the request");
    }
  };

  // Handle Aprovar button click (sets state to "Aguardar Envio")
  const handleApprove = async (requisicaoID) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token available.");

      const response = await fetch(
        `http://4.211.87.132:5000/api/requests/approve/${requisicaoID}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve the request");
      }

      const updatedRequisicoes = requisicoes.map((req) =>
        req.requisicaoID === requisicaoID
          ? { ...req, estadoID: 3 } // Set state to "Aguardar Envio"
          : req
      );

      setRequisicoes(updatedRequisicoes);
    } catch (error) {
      console.error("Error approving request:", error);
      setError("Failed to approve the request");
    }
  };

  const handleCancel = async (requisicaoID) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token available.");

      const response = await fetch(
        `http://4.211.87.132:5000/api/requests/cancel/${requisicaoID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to cancel request.");

      setRequisicoes((prevRequisicoes) =>
        prevRequisicoes.map((req) =>
          req.requisicaoID === requisicaoID ? { ...req, estadoID: 2 } : req
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "medicamentoID" || name === "quantidadeEnviada") {
      // Handle nested medicamento data
      setNewRequest((prev) => {
        const medicamentos = [...prev.medicamentos];
        if (medicamentos.length === 0) medicamentos.push({});

        medicamentos[0][
          name === "medicamentoID" ? "medicamentoID" : "quantidade"
        ] = value;

        return {
          ...prev,
          medicamentos,
        };
      });
    } else {
      // Handle other fields, including servicoID
      setNewRequest((prev) => ({
        ...prev,
        [name]: value, // Dynamically update the state key based on the input name
      }));
    }
  };

  const handleCreateRequest = () => {
    setShowCreateForm(true);
  };

  const submitCreateRequest = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token available.");

      // Validate mandatory fields
      if (!newRequest.servicoID)
        throw new Error("Serviço Hospitalar is required.");
      if (
        !Array.isArray(newRequest.medicamentos) ||
        newRequest.medicamentos.length === 0
      ) {
        throw new Error("At least one Medicamento is required.");
      }

      // Format medicamentos array
      const formattedMedicamentos = newRequest.medicamentos.map((med) => {
        if (!med.medicamentoID || !med.quantidade) {
          throw new Error(
            "Invalid medicamento data: medicamentoID and quantidade are required."
          );
        }
        return {
          medicamentoID: med.medicamentoID,
          quantidade: med.quantidade,
        };
      });

      // Construct payload with estadoID defaulting to 1
      const payload = {
        servicoHospitalarRemetenteID: newRequest.servicoID, // Correctly mapped value
        dataRequisicao: new Date(newRequest.dataRequisicao).toISOString(),
        dataEntrega: new Date(newRequest.dataEntrega).toISOString(),
        medicamentos: formattedMedicamentos,
        estadoID: 1, // Default value for estadoID
      };

      console.log("Payload:", payload); // Debug payload before sending

      // Send request to API
      const response = await fetch(
        "http://4.211.87.132:5000/api/requests/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("API Error:", errorResponse);
        throw new Error(errorResponse.message || "Failed to create request.");
      }

      const createdRequest = await response.json();
      console.log("Created request:", createdRequest);

      // Update UI state
      setRequisicoes((prevRequisicoes) => [...prevRequisicoes, createdRequest]);
      setShowCreateForm(false);
    } catch (err) {
      console.error("Error in submitCreateRequest:", err);
      setError(err.message);
    }
  };

  const getEstadoName = (estadoID) => ESTADO_MAP[estadoID] || "Desconhecido";

  return (
    <div className="requests-page">
      <Toolbar
        name="Requisições"
        buttonLabel="Criar Requisição"
        onButtonClick={handleCreateRequest}
      />
      <div className="requests-content">
        {error && <p>{error}</p>}
        {requisicoes.length > 0 ? (
          <div className="requests-table-container">
            <div className="requests-table-header">
              <div className="column-id">ID</div>
              <div className="column">Medicamento</div>
              <div className="column">Quantidade</div>
              <div className="column">Criado por (Serviço)</div>
              <div className="column">Enviado por (Serviço)</div>
              <div className="column">Criado por (Profissional)</div>
              <div className="column">Data Requisição</div>
              <div className="column">Data Entrega</div>
              <div className="column">Estado</div>
              <div className="column">Ações</div>
            </div>
            {requisicoes.map((req) => (
              <div className="requests-table-row" key={req.requisicaoID}>
                <div className="column-id">{req.requisicaoID}</div>
                <div className="column">
                  {medicamentosList[req.medicamentoID]?.nomeMedicamento}
                </div>
                <div className="column">{req.quantidadeMedicamento}</div>
                <div className="column">{req.nomeServico}</div>
                <div className="column">
                  {req.nomeServicoHospitalarRemetente}
                </div>
                <div className="column">
                  {req.nomeProfissional} {req.ultimoNomeProfissional}
                </div>
                <div className="column">
                  {new Date(req.dataRequisicao).toLocaleDateString()}
                </div>
                <div className="column">
                  {new Date(req.dataEntrega).toLocaleDateString()}
                </div>
                <div
                  className={`column estado ${getEstadoClass(req.estadoID)}`}
                >
                  {getEstadoName(req.estadoID)}
                </div>
                <div className="column">
                  {/* Only show buttons when the state is not Concluído (estadoID = 4) or Cancelado (estadoID = 2) */}
                  {req.estadoID !== 4 && req.estadoID !== 2 ? (
                    <>
                      {req.estadoID === 1 || req.estadoID === 2 ? (
                        <button
                          className="approve-btn"
                          onClick={() => handleApprove(req.requisicaoID)}
                          disabled={
                            req.estadoID === 3 ||
                            req.estadoID === 4 ||
                            req.estadoID === 2
                          }
                        >
                          Aprovar
                        </button>
                      ) : req.estadoID === 3 ? (
                        <button
                          className="concluir-btn"
                          onClick={() => handleConcluir(req.requisicaoID)}
                          disabled={req.estadoID === 4 || req.estadoID === 2}
                        >
                          Concluir
                        </button>
                      ) : (
                        <span className="status-completed">
                          Aprovado / Concluído
                        </span>
                      )}
                      <button
                        className="cancel-btn"
                        onClick={() => handleCancel(req.requisicaoID)}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : null}{" "}
                  {/* No buttons will be rendered if estadoID is 4 or 2 */}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Não há requisições disponíveis.</p>
        )}
      </div>

      {showCreateForm && (
        <div
          className="modal-overlay-request"
          onClick={() => setShowCreateForm(false)}
        >
          <div className="modal-request" onClick={(e) => e.stopPropagation()}>
            <form
              className="request-form-request"
              onSubmit={submitCreateRequest}
            >
              <label htmlFor="dataRequisicao">Data da Requisição</label>
              <input
                type="date"
                name="dataRequisicao"
                value={newRequest.dataRequisicao}
                disabled
              />
              <label htmlFor="dataEntrega">Data de Entrega</label>
              <input
                type="date"
                name="dataEntrega"
                value={newRequest.dataEntrega}
                onChange={handleInputChange}
                required
              />
              <div className="medicamento-form">
                <label htmlFor="medicamentoID">Medicamento</label>
                <select
                  name="medicamentoID"
                  value={newRequest.medicamentos[0]?.medicamentoID || ""}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>
                    Selecione um Medicamento
                  </option>
                  {medicamentosList.map((med) => (
                    <option key={med.medicamentoID} value={med.medicamentoID}>
                      {med.nomeMedicamento}
                    </option>
                  ))}
                </select>

                <label htmlFor="servicoID">Serviço Hospitalar</label>
                <select
                  name="servicoID"
                  value={newRequest.servicoID}
                  onChange={handleInputChange}
                  required
                  disabled={availableServicos.length === 0}
                >
                  <option value="" disabled>
                    Selecione um Serviço
                  </option>
                  {availableServicos.length > 0 ? (
                    availableServicos.map((servico) => (
                      <option key={servico.servicoID} value={servico.servicoID}>
                        {servico.nomeServico}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      Nenhum serviço disponível
                    </option>
                  )}
                </select>
                <label htmlFor="quantidadeEnviada">Quantidade</label>
                <input
                  type="number"
                  name="quantidadeEnviada"
                  value={newRequest.quantidadeMedicamento}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit">Criar Requisição</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Request;
