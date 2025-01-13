import React, { useState, useEffect } from "react";
import Toolbar from "../Toolbar";
import "./Encomendas.css";

const Encomendas = () => {
  const [userName, setUserName] = useState("");
  const [medicamentos, setMedicamentos] = useState([]);
  const [encomendas, setEncomendas] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newEncomenda, setNewEncomenda] = useState({
    dataEncomenda: new Date().toISOString().split("T")[0],
    fornecedorID: "",
    quantidadeEnviada: "",
    dataEntrega: "",
    createdBy: "",
  });

  // Fetch Medicamentos
  useEffect(() => {
    const fetchMedicamentos = async () => {
      try {
        const response = await fetch(
          "http://4.211.87.132:5000/api/products/all"
        );
        const data = await response.json();
        setMedicamentos(data);
      } catch (error) {
        console.error("Failed to fetch medicamentos:", error);
      }
    };
    fetchMedicamentos();
  }, []);

  const fetchEncomendas = async () => {
    try {
      const response = await fetch("http://4.211.87.132:5000/api/orders/all");
      if (!response.ok) throw new Error("Failed to fetch encomendas");
      const data = await response.json();
      setEncomendas(data);
    } catch (error) {
      setError("Failed to load encomendas data");
      console.error(error);
    }
  };

  const fetchFornecedores = async () => {
    try {
      const response = await fetch("http://4.211.87.132:5000/api/supplier/all");
      if (!response.ok) throw new Error("Failed to fetch fornecedores");
      const data = await response.json();
      setFornecedores(data.recordset || []);
    } catch (error) {
      setError("Failed to load fornecedores data");
      console.error(error);
    }
  };

  useEffect(() => {
    // Retrieve the user's name from local storage
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");
    if (firstName && lastName) {
      const fullName = `${firstName} ${lastName}`;
      setUserName(fullName);
      setNewEncomenda((prev) => ({ ...prev, createdBy: fullName }));
    }
  }, []);

  useEffect(() => {
    fetchEncomendas();
    fetchFornecedores();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEncomenda((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateOrder = () => {
    setShowCreateForm(true);
  };

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token available.");

      const response = await fetch(
        `http://4.211.87.132:5000/api/orders/approve/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to approve order");
      await fetchEncomendas(); // Refresh the list after approval
    } catch (error) {
      setError("Failed to approve order");
      console.error("Approve Order Error:", error);
    }
  };

  const handleCancel = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token available.");

      const response = await fetch(
        `http://4.211.87.132:5000/api/orders/cancel/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to cancel order");

      await fetchEncomendas(); // Refresh the list after cancellation
    } catch (error) {
      setError("Failed to cancel order");
      console.error("Cancel Order Error:", error);
    }
  };

  const submitCreateOrder = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token available.");
  
      // Add medicamento details to the payload
      const medicamento = medicamentos.find(
        (med) => med.medicamentoID === parseInt(newEncomenda.medicamentoID)
      );
      const medicamentoDetails = medicamento
        ? {
            medicamentoID: medicamento.medicamentoID,
            nomeMedicamento: medicamento.nomeMedicamento,
            quantidade: newEncomenda.quantidadeEnviada,
          }
        : [];
  
      // Prepare payload with medicamentos array
      const payload = {
        ...newEncomenda,
        estadoID: 1,
        medicamentos: [medicamentoDetails], // Include medicamentos array with both ID and name
      };
  
      const response = await fetch(
        "http://4.211.87.132:5000/api/orders/create",
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
        const errorDetails = await response.json();
        console.error("Server Error Details:", errorDetails);
        throw new Error("Failed to create order");
      }
  
      const createdOrder = await response.json();
      setEncomendas((prev) => [...prev, createdOrder]); // Update the orders list
      setShowCreateForm(false);
      window.location.reload();
      
    } catch (error) {
      setError("Failed to create order");
      console.error("Submit Create Order Error:", error);
    }
  };

  const getStatusClass = (estadoID) => {
    switch (estadoID) {
      case 1: // Pendente
        return "status-pending";
      case 2: // Cancelada
        return "status-refused";
      case 3: // Aguardar Envio
        return "status-awaiting-shipment";
      case 4: // Completa
        return "status-approved";
      default:
        return "";
    }
  };

  const getStatusText = (estadoID) => {
    switch (estadoID) {
      case 1:
        return "Pendente";
      case 2:
        return "Cancelada";
      case 3:
        return "Aguardar Envio";
      case 4:
        return "Completa";
      default:
        return "Desconhecido";
    }
  };

  return (
    <div className="encomendas-page">
      <Toolbar
        name="Encomendas"
        buttonLabel="Nova Encomenda"
        onButtonClick={handleCreateOrder}
      />
      <div className="encomendas-content">
        {error && <p>{error}</p>}
        {encomendas && encomendas.length > 0 ? (
          <div className="encomendas-table-container">
            {/* Table Header */}
            <div className="encomendas-table-header">
              <div className="column-id">#</div>
              <div className="column">Medicamento</div>
              <div className="column">Criado por</div>
              <div className="column">Fornecedor</div>
              <div className="column">Criado em</div>
              <div className="column">Quantidade Encomendada</div>
              <div className="column">Previsão de Entrega</div>
              <div className="column-state">Estado</div>
              <div className="column">Ações</div>
            </div>
            {/* Table Rows */}
            {encomendas.map((encomenda, index) => (
              <div className="encomendas-table-row" key={index}>
                <div className="column-id">{encomenda.encomendaID}</div>
                <div className="column">
                  {/* Check if medicamentos exists and is an array */}
                  {Array.isArray(encomenda.medicamentos) &&
                  encomenda.medicamentos.length > 0 ? (
                    encomenda.medicamentos.map((medicamento) => (
                      <div key={medicamento.medicamentoID}>
                        {medicamento.nomeMedicamento}
                      </div>
                    ))
                  ) : (
                    <span>No Medicamentos</span>
                  )}
                </div>
                <div className="column">
                  {encomenda.profissionalNome}{" "}
                  {encomenda.profissionalUltimoNome}
                </div>
                <div className="column">{encomenda.nomeFornecedor}</div>
                <div className="column">
                  {new Date(encomenda.dataEncomenda).toLocaleDateString()}
                </div>
                <div className="column">{encomenda.quantidadeEnviada}</div>
                <div className="column">
                  {encomenda.dataEntrega
                    ? new Date(encomenda.dataEntrega).toLocaleDateString()
                    : "N/A"}
                </div>
                <div
                  className={`column-state ${getStatusClass(
                    encomenda.estadoID
                  )}`}
                >
                  {getStatusText(encomenda.estadoID)}
                </div>
                <div className="column actions">
                  <button
                    className="approve-btn"
                    onClick={() => handleApprove(encomenda.encomendaID)}
                  >
                    Aprovar
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => handleCancel(encomenda.encomendaID)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No encomendas found.</p>
        )}
      </div>

      {showCreateForm && (
        <div className="modal-overlay" onClick={() => setShowCreateForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <form className="create-order-form" onSubmit={submitCreateOrder}>
              <label htmlFor="createdBy">Criado por</label>
              <input
                type="text"
                name="createdBy"
                value={newEncomenda.createdBy}
                disabled
              />
              <label htmlFor="dataRequisicao">Criado em</label>
              <input
                type="date"
                name="dataEncomenda"
                value={newEncomenda.dataEncomenda}
                disabled
              />
              <label htmlFor="dataEntrega">Previsão de Entrega</label>
              <input
                type="date"
                name="dataEntrega"
                value={newEncomenda.dataEntrega}
                onChange={handleInputChange}
              />
              <label htmlFor="fornecedorID">Fornecedor</label>
              <select
                name="fornecedorID"
                value={newEncomenda.fornecedorID}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecione um fornecedor</option>
                {fornecedores.map((fornecedor) => (
                  <option
                    key={fornecedor.fornecedorID}
                    value={fornecedor.fornecedorID}
                  >
                    {fornecedor.nomeFornecedor}
                  </option>
                ))}
              </select>
              <label htmlFor="medicamentoID">Medicamento</label>
              <select
                name="medicamentoID"
                value={newEncomenda.medicamentoID}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecione um medicamento</option>
                {medicamentos.map((medicamento) => (
                  <option
                    key={medicamento.medicamentoID}
                    value={medicamento.medicamentoID}
                  >
                    {medicamento.nomeMedicamento} ({medicamento.tipoMedicamento}
                    )
                  </option>
                ))}
              </select>
              <label htmlFor="quantidadeEnviada">Quantidade</label>
              <input
                type="number"
                name="quantidadeEnviada"
                value={newEncomenda.quantidadeEnviada}
                onChange={handleInputChange}
                required
              />
              <button type="submit">Criar Encomenda</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Encomendas;
