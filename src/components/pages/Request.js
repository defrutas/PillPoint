import React, { useState, useEffect } from 'react';
import './Request.css';
import Toolbar from '../Toolbar';

const ESTADO_MAP = {
  1: 'Pendente',
  2: 'Cancelado',
  3: 'Aguardar Envio',
  4: 'Concluído',
};

const Request = () => {
  const [requisicoes, setRequisicoes] = useState([]);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRequest, setNewRequest] = useState({
    dataRequisicao: new Date().toISOString().split('T')[0],
    dataEntrega: '',
    estadoID: 1,
    adminID: null,
    aprovadoPorAdministrador: 0,
    requisicaoCompleta: 0,
    medicamentos: [{ medicamentoID: '', quantidade: '' }],
    servicoID: '',
  });

  const [medicamentosList, setMedicamentosList] = useState([]);
  const [servicosList, setServicosList] = useState([]);
  const [availableServicos, setAvailableServicos] = useState([]);

  useEffect(() => {
    const fetchRequisicoes = async () => {
      try {
        const response = await fetch('http://4.211.87.132:5000/api/requests/all');
        if (!response.ok) throw new Error('Failed to fetch requisicoes');
        const data = await response.json();
        setRequisicoes(data);
      } catch (err) {
        setError('Failed to load requisicoes data.');
      }
    };

    const fetchMedicamentos = async () => {
      try {
        const response = await fetch('http://4.211.87.132:5000/api/products/all');
        if (!response.ok) throw new Error('Failed to fetch medicamentos');
        const data = await response.json();
        setMedicamentosList(data);
      } catch (err) {
        setError('Failed to load medicamentos data.');
      }
    };

    const fetchServicos = async () => {
      try {
        const response = await fetch('http://4.211.87.132:5000/api/services/all');
        if (!response.ok) throw new Error('Failed to fetch serviços hospitalares');
        const data = await response.json();
        setServicosList(data.map((servico) => servico.nomeServico));
      } catch (err) {
        setError('Failed to load serviços hospitalares.');
      }
    };

    fetchRequisicoes();
    fetchMedicamentos();
    fetchServicos();
  }, []);

  // Fetch available services when medicamento is selected
// Fetch available services when medicamento is selected
useEffect(() => {
  if (newRequest.medicamentos[0]?.medicamentoID) {
    const fetchAvailableServicos = async () => {
      try {
        const medicamentoID = newRequest.medicamentos[0].medicamentoID;
        const response = await fetch(`http://4.211.87.132:5000/api/requests/${medicamentoID}/servicos`);
        if (!response.ok) throw new Error('Failed to fetch available services for this medicamento');
        const data = await response.json();
        setAvailableServicos(data); // Update available services
      } catch (err) {
        setError('Failed to load available services.');
      }
    };

    fetchAvailableServicos();
  } else {
    setAvailableServicos([]); // Reset services if no medicamento selected
  }
}, [newRequest.medicamentos[0]?.medicamentoID]); // Dependency on medicamentoID

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'medicamentoID' || name === 'quantidade') {
      setNewRequest((prevState) => ({
        ...prevState,
        medicamentos: [
          {
            ...prevState.medicamentos[0],
            [name]: value,
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
    setShowCreateForm(true);
  };

  const submitCreateRequest = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token available.');

      const payload = {
        ...newRequest,
        medicamentos: newRequest.medicamentos.map((med) => ({
          medicamentoID: med.medicamentoID,
          quantidade: med.quantidade,
        })),
        dataRequisicao: new Date(newRequest.dataRequisicao).toISOString(),
        dataEntrega: new Date(newRequest.dataEntrega).toISOString(),
      };

      const response = await fetch('http://4.211.87.132:5000/api/requests/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to create request.');

      const createdRequest = await response.json();
      setRequisicoes((prevRequisicoes) => [...prevRequisicoes, createdRequest]);
      setShowCreateForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const getEstadoName = (estadoID) => ESTADO_MAP[estadoID] || 'Desconhecido';

  // Handler for approving a request
  const approveRequest = async (requisicaoID) => {
    try {
      const response = await fetch(`http://4.211.87.132:5000/api/requests/approve/${requisicaoID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to approve request.');
      
      setRequisicoes((prevRequisicoes) =>
        prevRequisicoes.map((req) =>
          req.requisicaoID === requisicaoID ? { ...req, estadoID: 4 } : req
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Handler for canceling a request
  const cancelRequest = async (requisicaoID) => {
    try {
      const response = await fetch(`http://4.211.87.132:5000/api/requests/cancel/${requisicaoID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to cancel request.');
      
      setRequisicoes((prevRequisicoes) =>
        prevRequisicoes.map((req) =>
          req.requisicaoID === requisicaoID ? { ...req, estadoID: 2 } : req
        )
      );
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
              <div className="column">Nome Serviço</div>
              <div className="column">Data Requisição</div>
              <div className="column">Data Entrega</div>
              <div className="column">Estado</div>
              <div className="column">Ações</div>
            </div>
            {requisicoes.map((req) => (
              <div className="requests-table-row" key={req.requisicaoID}>
                <div className="column">{req.requisicaoID}</div>
                <div className="column">{req.nomeServico}</div>
                <div className="column">{new Date(req.dataRequisicao).toLocaleDateString()}</div>
                <div className="column">{new Date(req.dataEntrega).toLocaleDateString()}</div>
                <div className="column">{getEstadoName(req.estadoID)}</div>
                <div className="column">
                  {req.estadoID === 1 && (
                    <>
                      <button onClick={() => approveRequest(req.requisicaoID)} className="approve-button">
                        Aprovar
                      </button>
                      <button onClick={() => cancelRequest(req.requisicaoID)} className="cancel-button">
                        Cancelar
                      </button>
                    </>
                  )}
                </div>
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
              <label htmlFor="dataRequisicao">Data da Requisição</label>
              <input type="date" name="dataRequisicao" value={newRequest.dataRequisicao} disabled />

              <label htmlFor="dataEntrega">Data de Entrega</label>
              <input type="date" name="dataEntrega" value={newRequest.dataEntrega} onChange={handleInputChange} required />

              <div className="medicamento-form">
                <label htmlFor="medicamentoID">Medicamento</label>
                <select
                  name="medicamentoID"
                  value={newRequest.medicamentos[0]?.medicamentoID || ''}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>Selecione um Medicamento</option>
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
                  <option value="" disabled>Selecione um Serviço</option>
                  {availableServicos.length > 0 ? (
                    availableServicos.map((servico) => (
                      <option key={servico.servicoID} value={servico.servicoID}>
                        {servico.nomeServico}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>Nenhum serviço disponível para este medicamento</option>
                  )}
                </select>

                <input
                  type="number"
                  name="quantidade"
                  value={newRequest.medicamentos[0]?.quantidade || ''}
                  onChange={handleInputChange}
                  placeholder="Quantidade"
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
