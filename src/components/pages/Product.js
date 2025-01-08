import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Product.css';

const Product = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newMedication, setNewMedication] = useState({
    nomeMedicamento: '',
    tipoMedicamento: '',
    descricao: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in and if the user is an admin
    const checkAdminStatus = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the JWT token
          setIsAdmin(decodedToken.isAdmin); // Set the admin status from the token
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

    checkAdminStatus();  // Check if the user is an admin based on the JWT token
    fetchMedicamentos();  // Fetch the medicamentos
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMedication({ ...newMedication, [name]: value });
  };

  const handleCreateMedication = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');  // Get token from localStorage
    try {
      const response = await fetch('http://4.211.87.132:5000/api/products/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Add Authorization header
        },
        body: JSON.stringify(newMedication),
      });
      if (!response.ok) {
        throw new Error('Failed to create medication');
      }
      const createdMedication = await response.json();
      setMedicamentos([...medicamentos, createdMedication]);
      setShowCreateForm(false); // Close the form after successful creation
    } catch (error) {
      console.error('Error creating medication:', error);
    }
  };

  return (
    <div className="product-page">
      <div className="product-content">
        {error && <p>{error}</p>}
        {medicamentos.length > 0 ? (
          <div className="product-table-container">
            <div className="product-table-header">
              <div className="column">#</div>
              <div className="column">Nome</div>
              <div className="column">Descrição</div>
              <div className="column">Quantidade Disponível</div>
            </div>

            {medicamentos.map((medicamento, index) => (
              <div className="product-table-row" key={index}>
                <div className="column">{medicamento.medicamentoid}</div>
                <div className="column">{medicamento.nomemedicamento}</div>
                <div className="column">{medicamento.descricao}</div>
                <div className="column">{medicamento.quantidadedisponivel}</div>
              </div>
            ))}
          </div>
        ) : (
          <p>Não há medicamentos disponíveis.</p>
        )}

        {/* Admin-specific Button */}
        {isAdmin && (
          <button className="admin-button" onClick={() => setShowCreateForm(!showCreateForm)}>
            Criar Medicamento
          </button>
        )}
      </div>

      {showCreateForm && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Criar Novo Medicamento</h3>
            <form onSubmit={handleCreateMedication}>
              <input
                type="text"
                name="nomeMedicamento"
                placeholder="Nome do Medicamento"
                value={newMedication.nomeMedicamento}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="tipoMedicamento"
                placeholder="Tipo do Medicamento"
                value={newMedication.tipoMedicamento}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="descricao"
                placeholder="Descrição"
                value={newMedication.descricao}
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
