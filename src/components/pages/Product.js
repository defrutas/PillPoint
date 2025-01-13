import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Product.css";
import Toolbar from "../Toolbar";

const Product = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newMedication, setNewMedication] = useState({
    nomeMedicamento: "",
    tipoMedicamento: "",
    dataValidade: "",
    lote: "",
    descricao: "",
  });
  const [editingMedicationID, setEditingMedicationID] = useState(null); // Track the ID of the medication being edited
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedicamentos = async () => {
      try {
        const response = await fetch(
          "http://4.211.87.132:5000/api/products/all"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setMedicamentos(data);
      } catch (error) {
        setError("Failed to load medicamentos data");
        console.error(error);
      }
    };
    fetchMedicamentos();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMedication({ ...newMedication, [name]: value });
  };

  const handleCreateMedication = () => {
    setShowCreateForm(true);
    setEditingMedicationID(null); // Reset editing state for new creation
    setNewMedication({
      nomeMedicamento: "",
      tipoMedicamento: "",
      dataValidade: "",
      lote: "",
    }); // Clear form fields
  };

  const handleEditMedication = (medicamento) => {
    setShowCreateForm(true);
    setEditingMedicationID(medicamento.medicamentoID); // Set the ID of the medication being edited
    setNewMedication({
      nomeMedicamento: medicamento.nomeMedicamento,
      tipoMedicamento: medicamento.tipoMedicamento,
      dataValidade: medicamento.dataValidade,
      lote: medicamento.lote,
    });
  };

  const handleDeleteMedication = async (medicamentoID) => {
    // Get the token from localStorage
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(
        `http://4.211.87.132:5000/api/products/delete/${medicamentoID}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Failed to delete medication");
      }

      // Remove the deleted medication from the state list
      setMedicamentos((prevMedicamentos) =>
        prevMedicamentos.filter((med) => med.medicamentoID !== medicamentoID)
      );
    } catch (error) {
      setError("Failed to delete medication: " + error.message);
      console.error(error);
    }
  };

  const submitCreateMedication = async (e) => {
    e.preventDefault(); // Prevent the form from reloading the page

    // Get the token from localStorage
    const token = localStorage.getItem("authToken");

    const medicationData = {
      nomeMedicamento: newMedication.nomeMedicamento,
      tipoMedicamento: newMedication.tipoMedicamento,
      dataValidade: newMedication.dataValidade,
      lote: newMedication.lote,
    };

    try {
      let response;

      if (editingMedicationID) {
        // Update existing medication
        response = await fetch(
          `http://4.211.87.132:5000/api/products/update/${editingMedicationID}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
              "Content-Type": "application/json",
            },
            body: JSON.stringify(medicationData),
          }
        );
      } else {
        // Create new medication
        response = await fetch(
          "http://4.211.87.132:5000/api/products/new",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
              "Content-Type": "application/json",
            },
            body: JSON.stringify(medicationData),
          }
        );
      }

      if (!response.ok) {
        const errorResponse = await response.json(); // Capture the error response
        throw new Error(
          errorResponse.message || "Failed to create or update medication"
        );
      }

      const result = await response.json();

      if (editingMedicationID) {
        // Update the existing medication in the state list
        setMedicamentos((prevMedicamentos) =>
          prevMedicamentos.map((med) =>
            med.medicamentoID === editingMedicationID ? result : med
          )
        );
      } else {
        // Add the newly created medication to the list
        setMedicamentos((prevMedicamentos) => [...prevMedicamentos, result]);
      }

      setNewMedication({
        nomeMedicamento: "",
        tipoMedicamento: "",
        dataValidade: "",
        lote: "",
      }); // Reset form fields
      setShowCreateForm(false);
      window.location.reload();
    } catch (error) {
      setError("Failed to create or update medication: " + error.message);
      console.error(error);
    }
  };

  return (
    <div className="product-page">
      <Toolbar
        name="Medicamentos"
        buttonLabel="Adicionar Medicamento"
        onButtonClick={handleCreateMedication}
      />
      <div className="product-content">
        {error && <p>{error}</p>}
        {medicamentos.length > 0 ? (
          <div className="product-table-container">
            <div className="product-table-header">
              <div className="column-id">#</div>
              <div className="column">Nome</div>
              <div className="column">Tipo</div>
              <div className="column">Quantidade</div>
              <div className="column">Data de Validade</div>
              <div className="column">Lote</div>
              <div className="column">Ações</div>
            </div>
            {medicamentos.map((medicamento, index) => (
              <div className="product-table-row" key={index}>
                <div className="column-id">{medicamento.medicamentoID}</div>
                <div className="column">{medicamento.nomeMedicamento}</div>
                <div className="column">{medicamento.tipoMedicamento}</div>
                <div className="column">{medicamento.stockGlobal}</div>
                <div className="column">
                  {new Date(medicamento.dataValidade).toLocaleDateString()}
                </div>
                <div className="column">{medicamento.lote}</div>
                <div className="column">
                  <button
                    className="edit-btn"
                    onClick={() => handleEditMedication(medicamento)}
                  >
                    Editar
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteMedication(medicamento.medicamentoID)}
                  >
                    Apagar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Não há medicamentos disponíveis.</p>
        )}
      </div>

      {showCreateForm && (
        <div className="popup-overlay">
          <div className="popup-products">
            <h3>{editingMedicationID ? "Editar Medicamento" : "Criar Novo Medicamento"}</h3>
            <form className="products-form" onSubmit={submitCreateMedication}>
              <input
                className="input-product"
                type="text"
                name="nomeMedicamento"
                placeholder="Nome do Medicamento"
                value={newMedication.nomeMedicamento}
                onChange={handleInputChange}
                required
              />
              <input
                className="input-product"
                type="text"
                name="tipoMedicamento"
                placeholder="Tipo do Medicamento"
                value={newMedication.tipoMedicamento}
                onChange={handleInputChange}
                required
              />
              <input
                className="input-product"
                type="date"
                name="dataValidade"
                placeholder="Data de Validade"
                value={newMedication.dataValidade}
                onChange={handleInputChange}
                required
              />
              <input
                className="input-product"
                type="text"
                name="lote"
                placeholder="Lote"
                value={newMedication.lote}
                onChange={handleInputChange}
                required
              />
              <button type="submit">Salvar</button>
            </form>
            <button
              className="close-button"
              onClick={() => setShowCreateForm(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
