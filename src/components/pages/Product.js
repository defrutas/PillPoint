import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Product.css';
import Toolbar from '../Toolbar';

const Product = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newMedication, setNewMedication] = useState({
    nomeMedicamento: '',
    tipoMedicamento: '',
    dataValidade: '',
    lote: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          setIsAdmin(decodedToken.isAdmin);
        } catch (error) {
          console.error('Failed to decode token', error);
        }
      }
    };

    const fetchMedicamentos = async () => {
      try {
        const response = await fetch('http://4.211.87.132:5000/api/products/all');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setMedicamentos(data);
      } catch (error) {
        setError('Failed to load medicamentos data');
        console.error(error);
      }
    };

    checkAdminStatus();
    fetchMedicamentos();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMedication({ ...newMedication, [name]: value });
  };

  const handleCreateMedication = () => {
    setShowCreateForm(true);
  };

  const submitCreateMedication = async (e) => {
    e.preventDefault();
  
    try {
      // Retrieve token from localStorage
      const token = localStorage.getItem("token");  
      if (!token) throw new Error("No authentication token available.");
  
      // Ensure token is valid before proceeding
      if (token === "undefined" || token === null || token.trim() === "") {
        throw new Error("Token is invalid or empty.");
      }
  
      // Prepare the payload
      const payload = {
        ...newMedication,
      };
  
      const response = await fetch("http://4.211.87.132:5000/api/products/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to create medication.");
        } else {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to create medication.");
        }
      }
  
      const createdMedication = await response.json();
      setMedicamentos((prevMedicamentos) => [...prevMedicamentos, createdMedication]);
      setShowCreateForm(false);
      console.log("Medication created successfully:", createdMedication);
    } catch (err) {
      console.error("Error creating medication:", err.message);
      setError(err.message);
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
              <div className="column">#</div>
              <div className="column">Nome</div>
              <div className="column">Tipo</div>
              <div className="column">Quantidade</div>
              <div className="column">Data de Validade</div>
              <div className="column">Lote</div>
              <div className="column">Ações</div>
            </div>
            {medicamentos.map((medicamento, index) => (
              <div className="product-table-row" key={index}>
                <div className="column">{medicamento.medicamentoID}</div>
                <div className="column">{medicamento.nomeMedicamento}</div>
                <div className="column">{medicamento.tipoMedicamento}</div>
                <div className="column">{medicamento.stockGlobal}</div>
                <div className="column">{new Date(medicamento.dataValidade).toLocaleDateString()}</div>
                <div className="column">{medicamento.lote}</div>
                <div className="column">
                  <button className="edit-btn">Editar</button>
                  <button className="delete-btn">Apagar</button>
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
            <h3>Criar Novo Medicamento</h3>
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
            <button className="close-button" onClick={() => setShowCreateForm(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
