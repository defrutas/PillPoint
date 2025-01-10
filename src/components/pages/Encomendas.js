import React, { useState, useEffect } from "react";
import Toolbar from "../Toolbar";
import "./Encomendas.css";

const Encomendas = () => {
  const [userName, setUserName] = useState("");
  const [encomendas, setEncomendas] = useState([]);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newEncomenda, setNewEncomenda] = useState({
    dataEncomenda: new Date().toISOString().split("T")[0],
    fornecedorID: "",
    quantidadeEnviada: "",
    dataEntrega: "",
    createdBy: "", // Default field for the user's name
  });

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

  useEffect(() => {
    // Retrieve the user's name from local storage
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");
    if (firstName && lastName) {
      const fullName = `${firstName} ${lastName}`;
      setUserName(fullName);
      setNewEncomenda((prev) => ({ ...prev, createdBy: fullName })); // Set as default
    }
  }, []);

  useEffect(() => {
    fetchEncomendas();
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

  const submitCreateOrder = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://4.211.87.132:5000/api/orders/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newEncomenda),
        }
      );
      if (!response.ok) throw new Error("Failed to create order");
      const createdOrder = await response.json();
      setEncomendas((prev) => [...prev, createdOrder]);
      setShowCreateForm(false);
    } catch (error) {
      setError("Failed to create order");
      console.error(error);
    }
  };

  const getStatusClass = (status) => {
    if (status === "Approved") return "status-approved";
    if (status === "Pending") return "status-pending";
    if (status === "Refused") return "status-refused";
    return "";
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
        {encomendas.length > 0 ? (
          <div className="encomendas-table-container">
            {/* Table Header */}
            <div className="encomendas-table-header">
              <div className="column">#</div>
              <div className="column">Criado por</div>
              <div className="column">Fornecedor</div>
              <div className="column">Criado em</div>
              <div className="column">Quantidade Encomendada</div>
              <div className="column">Previsão de Entrega</div>
              <div className="column">Estado</div>
            </div>
            {/* Table Rows */}
            {encomendas.map((encomenda, index) => (
              <div className="encomendas-table-row" key={index}>
                <div className="column">{encomenda.encomendaID}</div>
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
                  className={`column ${getStatusClass(
                    encomenda.status ||
                      (encomenda.aprovadoporadministrador
                        ? "Approved"
                        : "Pending")
                  )}`}
                >
                  {encomenda.status ||
                    (encomenda.aprovadoporadministrador
                      ? "Aprovado"
                      : "Pendente")}
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
              <label htmlFor="nomeFornecedor">Fornecedor</label>
              <input
                type="text"
                name="nomeFornecedor"
                value={newEncomenda.nomeFornecedor}
                onChange={handleInputChange}
                required
              />
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
