import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Toolbar from '../Toolbar';
import './Product.css';

const Product = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newMedication, setNewMedication] = useState({
    nomeMedicamento: '',
    tipoID: '',
    descricao: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch admin status
    const fetchAdminStatus = async () => {
      try {
        const response = await fetch('http://4.211.87.132:5000/api/user/admin-status', {
          method: 'GET',
          credentials: 'include', // Ensure proper authentication handling
        });
        const data = await response.json();
        setIsAdmin(data.isAdmin);
      } catch (error) {
        console.error('Failed to fetch admin status', error);
      }
    };

    const fetchMedicamentos = async () => {
      try {
        const response = await fetch('http://4.211.87.132:5000/api/stock/inventory');
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

    fetchAdminStatus();
    fetchMedicamentos();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMedication({ ...newMedication, [name]: value });
  };

  const handleCreateMedication = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://4.211.87.132:5000/api/medication/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMedication),
      });
      if (!response.ok) {
        throw new Error('Failed to create medication');
      }
      const createdMedication = await response.json();
      setMedicamentos([...medicamentos, createdMedication]);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating medication:', error);
    }
  };

  return (
    <div className="product-page">
      <Toolbar 
        name="Medicamentos"
        buttonLabel="Readquirir Stock"
        onButtonClick={() => setShowCreateForm(!showCreateForm)}
      />
      <div className="product-content">
        {error && <p>{error}</p>}
        {medicamentos.length > 0 ? (
          <div className="product-table-container">
            <div className="product-table-header">
              <div className="column">#</div>
              <div className="column">Nome</div>
              <div className="column">Descrição</div>
              <div className="column">Quantidade Disponível</div>
              <div className="column">Quantidade Mínima</div>
            </div>

            {medicamentos.map((medicamento, index) => (
              <div className="product-table-row" key={index}>
                <div className="column">{medicamento.medicamentoid}</div>
                <div className="column">{medicamento.nomemedicamento}</div>
                <div className="column">{medicamento.descricao}</div>
                <div className="column">{medicamento.quantidadedisponivel}</div>
                <div className="column">{medicamento.quantidademinima}</div>
              </div>
            ))}
          </div>
        ) : (
          <p>Não há medicamentos abaixo da quantidade mínima.</p>
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
                name="tipoID"
                placeholder="Tipo ID"
                value={newMedication.tipoID}
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
