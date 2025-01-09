import React, { useState, useEffect } from 'react';
import './Request.css';
import Toolbar from '../Toolbar';

const Request = () => {
  const [requisicoes, setRequisicoes] = useState([]);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRequest, setNewRequest] = useState({
    dataRequisicao: new Date().toISOString().split('T')[0],
    dataEntrega: '',
    estadoID: 1,
    adminID: null,  // Set to null for the frontend to send a nullable value
    aprovadoPorAdministrador: 0,
    requisicaoCompleta: 0,
    medicamentos: [
      {
        medicamentoID: '',  // Make sure this is the ID
        quantidade: '',
      },
    ],
  });

  const [medicamentosList, setMedicamentosList] = useState([]);

  useEffect(() => {
    const fetchRequisicoes = async () => {
      try {
        const response = await fetch('http://4.211.87.132:5000/api/requests/all');
        if (!response.ok) {
          throw new Error('Failed to fetch requisicoes');
        }
        const data = await response.json();
        setRequisicoes(data);
      } catch (err) {
        setError('Failed to load requisicoes data');
      }
    };

    const fetchMedicamentos = async () => {
      try {
        const response = await fetch('http://4.211.87.132:5000/api/products/all');
        if (!response.ok) {
          throw new Error('Failed to fetch medicamentos');
        }
        const data = await response.json();
        setMedicamentosList(data); // Store the fetched list
      } catch (err) {
        setError('Failed to load medicamentos data');
      }
    };

    fetchRequisicoes();
    fetchMedicamentos();

    const currentDate = new Date().toISOString().split('T')[0];
    setNewRequest((prevState) => ({
      ...prevState,
      dataRequisicao: currentDate,
    }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'medicamentoID' || name === 'quantidade') {
      setNewRequest((prevState) => ({
        ...prevState,
        medicamentos: [
          {
            ...prevState.medicamentos[0],
            [name]: value,  // Correctly set the medicamentoID or quantidade in the state
          },
        ],
      }));
    } else {
      setNewRequest((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleCreateRequest = () => {
    setShowCreateForm(true); // Open the form
  };

  const submitCreateRequest = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('authToken');  // Ensure the token exists in localStorage
      console.log("Token in localStorage:", token);  // Verify if the token is retrieved

      if (!token) {
        throw new Error('No authentication token available.');
      }

      const payload = {
        ...newRequest,
        estadoID: 1, // Explicitly setting estadoID to 1
        adminID: null, // Sending null for adminID
        aprovadoPorAdministrador: 0, // Default value
        requisicaoCompleta: 0, // Default value
        medicamentos: newRequest.medicamentos.map((med) => ({
          medicamentoID: med.medicamentoID,  // Send the correct medicamentoID (ID, not the name)
          quantidade: med.quantidade,
        })),
        dataRequisicao: new Date(newRequest.dataRequisicao).toISOString(),
        dataEntrega: new Date(newRequest.dataEntrega).toISOString(),
      };

      const response = await fetch('http://4.211.87.132:5000/api/requests/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Make sure the JWT token is included here
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to create request');
      }

      const createdRequest = await response.json();
      setRequisicoes((prevRequisicoes) => [...prevRequisicoes, createdRequest]);
      setShowCreateForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

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
              <div className="column">ID</div>
              <div className="column">Data Requisição</div>
              <div className="column">Data Entrega</div>
              <div className="column">Medicamento</div>
              <div className="column">Quantidade</div>
            </div>
            {requisicoes.map((req) => (
              <div className="requests-table-row" key={req.requisicaoID}>
                <div className="column">{req.requisicaoID}</div>
                <div className="column">{new Date(req.dataRequisicao).toLocaleDateString()}</div>
                <div className="column">{new Date(req.dataEntrega).toLocaleDateString()}</div>
                <div className="column">{req.medicamentoID}</div>
                <div className="column">{req.quantidade}</div>
              </div>
            ))}
          </div>
        ) : (
          <p>Não há requisições disponíveis.</p>
        )}
      </div>

      {showCreateForm && (
        <div className="modal-overlay-request" onClick={() => setShowCreateForm(false)}>
          <div className="modal-request" onClick={(e) => e.stopPropagation()}>
            <form className="request-form-request" onSubmit={submitCreateRequest}>
              <input type="hidden" name="estadoID" value="2" />
              <input type="hidden" name="adminID" value={newRequest.adminID} />
              <input type="hidden" name="aprovadoPorAdministrador" value={newRequest.aprovadoPorAdministrador} />
              <input type="hidden" name="requisicaoCompleta" value={newRequest.requisicaoCompleta} />

              <label htmlFor="dataRequisicao">Data da Requisição</label>
              <input type="date" name="dataRequisicao" value={newRequest.dataRequisicao} disabled />

              <label htmlFor="dataEntrega">Data de Entrega</label>
              <input type="date" name="dataEntrega" value={newRequest.dataEntrega} onChange={handleInputChange} required />

              <div className="medicamento-form">
                <label htmlFor="medicamentoID">Medicamento</label>
                <select name="medicamentoID" value={newRequest.medicamentos[0]?.medicamentoID || ''} onChange={handleInputChange} required>
                  <option value="" disabled>Selecione um Medicamento</option>
                  {medicamentosList.map((med) => (
                    <option key={med.medicamentoID} value={med.medicamentoID}>{med.nomeMedicamento}</option>
                  ))}
                </select>

                <input type="number" name="quantidade" value={newRequest.medicamentos[0]?.quantidade || ''} onChange={handleInputChange} placeholder="Quantidade" required />
              </div>
              <button type="submit">Criar Requisição</button>
              <button type="button" onClick={() => setShowCreateForm(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Request;
