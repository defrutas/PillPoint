import React, { useState, useEffect } from "react";
import Toolbar from "../Toolbar"; // Toolbar component
import "./Alerts.css"; // Import the CSS file

const Alerts = () => {
  const [medications, setMedications] = useState([]);
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  const handleConfirmRequest = async (id) => {
    try {
      const response = await fetch(
        `http://4.211.87.132:5000/api/request/approve/${id}/confirm`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ aprovadoporadministrador: true }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to confirm request in the database.");
      }

      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.requisicaoid === id
            ? { ...request, aprovadoporadministrador: true }
            : request
        )
      );

      console.log(`Request ${id} confirmed and updated in the database.`);
    } catch (error) {
      console.error("Error confirming request:", error);
    }
  };

  const handleConfirmOrder = async (id) => {
    try {
      const response = await fetch(
        `http://4.211.87.132:5000/api/orders/approve/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ aprovadoporadministrador: true }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve order in the database.");
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.encomendaid === id
            ? { ...order, aprovadoporadministrador: true }
            : order
        )
      );

      console.log(`Order ${id} approved and updated in the database.`);
    } catch (error) {
      console.error("Error approving order:", error);
    }
  };

  const handleCreateOrder = async (medicationId) => {
    try {
      const response = await fetch(
        `http://4.211.87.132:5000/api/orders/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ medicamentoid: medicationId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create a new order.");
      }

      const newOrder = await response.json();

      setOrders((prevOrders) => [...prevOrders, newOrder]);
      console.log(`Order created for medication ID ${medicationId}.`);
    } catch (error) {
      console.error("Error creating new order:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://4.211.87.132:5000/api/notifications");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        if (data) {
          setMedications(data.medications || []);
          setOrders(data.orders || []);
          setRequests(data.requests || []);
        } else {
          setError("No data found");
        }
      } catch (error) {
        setError("Failed to load data");
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="alerts-page">
      <Toolbar name="Alerts" />
      <div className="alerts-content">
        {error && <p className="error-message">{error}</p>}

        {/* Medications Section */}
        <section className="alerts-section">
          <h2>Medicamentos</h2>
          {medications.length > 0 ? (
            <div className="alerts-table-container">
              <div className="alerts-table-header">
                <div className="column-id">ID</div>
                <div className="column-name">Name</div>
                <div className="column-description">Descricao</div>
                <div className="column-available">Disponivel</div>
                <div className="column-minimum">Minimo</div>
                <div className="column-action">Ação</div>
              </div>
              {medications.map((medication) => (
                <div
                  className="alerts-table-row"
                  key={medication.medicamentoid}
                >
                  <div className="column-id">{medication.medicamentoid}</div>
                  <div className="column-name">
                    {medication.nomemedicamento}
                  </div>
                  <div className="column-description">
                    {medication.descricao}
                  </div>
                  <div className="column-available">
                    {medication.quantidadedisponivel}
                  </div>
                  <div className="column-minimum">
                    {medication.quantidademinima}
                  </div>
                  <div className="column-action">
                    <button
                      className="create-order-button"
                      onClick={() =>
                        handleCreateOrder(medication.medicamentoid)
                      }
                    >
                      Criar Encomenda
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No medications available at the moment.</p>
          )}
        </section>

        {/* Orders Section */}
        <section className="alerts-section">
          <h2>Encomendas</h2>
          {orders.length > 0 ? (
            <div className="alerts-table-container">
              <div className="alerts-table-header">
                <div className="column-id">ID</div>
                <div className="column-name">Nome</div>
                <div className="column-complete">Completa?</div>
                <div className="column-approved">Aprovado?</div>
                <div className="column-order-date">Data de Encomenda</div>
                <div className="column-delivery-date">Data de Entrega</div>
                <div className="column-sent-quantity">Quantidade Enviada</div>
                <div className="column-action">Ação</div>
              </div>
              {orders.map((order) => (
                <div className="alerts-table-row" key={order.encomendaid}>
                  <div className="column-id">{order.encomendaid}</div>
                  <div className="column-name">
                    {`${order.nomeproprio} ${order.ultimonome}`}
                  </div>
                  <div className="column-complete">
                    {order.encomendacompleta ? "Sim" : "Nao"}
                  </div>
                  <div className="column-approved">
                    {order.aprovadoporadministrador ? "Sim" : "Nao"}
                  </div>
                  <div className="column-order-date">
                    {new Date(order.dataencomenda).toLocaleDateString()}
                  </div>
                  <div className="column-delivery-date">
                    {order.dataentrega
                      ? new Date(order.dataentrega).toLocaleDateString()
                      : "N/A"}
                  </div>
                  <div className="column-sent-quantity">
                    {order.quantidadeenviada}
                  </div>
                  <div className="column-action">
                    <button
                      className="confirm-button"
                      onClick={() =>
                        handleConfirmOrder(order.aprovadoporadministrador)
                      }
                    >
                      Aprovar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No orders available at the moment.</p>
          )}
        </section>

        {/* Requests Section */}
        <section className="alerts-section">
          <h2>Requisições</h2>
          {requests.length > 0 ? (
            <div className="alerts-table-container-request">
              <div className="alerts-table-header-request">
                <div className="column-id">ID</div>
                <div className="column-name">Nome</div>
                <div className="column-available">Data de Pedido</div>
                <div className="column-minimum">Data Prevista</div>
                <div className="column-approved">Aprovado?</div>
                <div className="column-action">Ação</div>
              </div>
              {requests.map((request) => (
                <div
                  className="alerts-table-row-request"
                  key={request.requisicaoid}
                >
                  <div className="column-id">{request.requisicaoid}</div>
                  <div className="column-name">
                    {`${request.nomeproprio} ${request.ultimonome}`}
                  </div>
                  <div className="column-available">
                    {new Date(request.datarequisicao).toLocaleDateString()}
                  </div>
                  <div className="column-minimum">
                    {request.dataentrega
                      ? new Date(request.dataentrega).toLocaleDateString()
                      : "N/A"}
                  </div>
                  <div className="column-approved">
                    {request.aprovadoporadministrador ? "Sim" : "Nao"}
                  </div>
                  <div className="column-action">
                    <button
                      className="confirm-button"
                      onClick={() => handleConfirmRequest(request.requisicaoid)}
                    >
                      Aprovar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No requests available at the moment.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Alerts;
