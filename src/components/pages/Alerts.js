import React, { useState, useEffect } from "react";
import Toolbar from "../Toolbar"; // Toolbar component
import "./Alerts.css"; // Import the CSS file

const Alerts = () => {
  const [medications, setMedications] = useState("");
  const [orders, setOrders] = useState("");
  const [requests, setRequests] = useState("");
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
        console.log("API Response:", data);

        // If the response contains messages, set them to the respective states
        setMedications(data.medications || "");
        setOrders(data.orders || "");
        setRequests(data.requests || "");
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
          {medications === "All medications are above the minimum quantity." ? (
            <p>{medications}</p>
          ) : medications ? (
            <div className="alerts-table-container">
              <div className="alerts-table-header">
                <div className="column-id">ID</div>
                <div className="column-name">Name</div>
                <div className="column-description">Descricao</div>
                <div className="column-available">Disponivel</div>
                <div className="column-minimum">Minimo</div>
                <div className="column-action">Ação</div>
              </div>
              {/* If medications were an array, you would map over them here */}
              {/* As it's now a string, no mapping is needed */}
            </div>
          ) : (
            <p>No medications available at the moment.</p>
          )}
        </section>

        {/* Orders Section */}
        <section className="alerts-section">
          <h2>Encomendas</h2>
          {orders === "No pending approval orders." ? (
            <p>{orders}</p>
          ) : orders ? (
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
              {/* If orders were an array, you would map over them here */}
            </div>
          ) : (
            <p>No orders available at the moment.</p>
          )}
        </section>

        {/* Requests Section */}
        <section className="alerts-section">
          <h2>Requisições</h2>
          {requests === "No pending approval requests." ? (
            <p>{requests}</p>
          ) : requests ? (
            <div className="alerts-table-container-request">
              <div className="alerts-table-header-request">
                <div className="column-id">ID</div>
                <div className="column-name">Nome</div>
                <div className="column-available">Data de Pedido</div>
                <div className="column-minimum">Data Prevista</div>
                <div className="column-approved">Aprovado?</div>
                <div className="column-action">Ação</div>
              </div>
              {/* If requests were an array, you would map over them here */}
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
