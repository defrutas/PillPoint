import React, { useState, useEffect } from 'react';
import './Request.css';
import Toolbar from '../Toolbar';

const Request = () => {
  const [requisicoes, setRequisicoes] = useState([]);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRequest, setNewRequest] = useState({
    dataRequisicao: '',
    dataEntrega: '',
    medicamentoID: '',
    quantidade: '',
  });

  // Assuming medicamentosList is fetched elsewhere in your app
  const medicamentosList = [
    { medicamentoID: 'med1', nomeMedicamento: 'Medicamento 1' },
    { medicamentoID: 'med2', nomeMedicamento: 'Medicamento 2' },
  ];

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

    fetchRequisicoes();

    const currentDate = new Date().toISOString().split('T')[0];
    setNewRequest((prevState) => ({
      ...prevState,
      dataRequisicao: currentDate,
    }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRequest({ ...newRequest, [name]: value });
  };

  const handleCreateRequest = () => {
    setShowCreateForm(true); // Open the form
  };

  const submitCreateRequest = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://4.211.87.132:5000/api/requests/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRequest),
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
              
              <label htmlFor="dataRequisicao">Data da Requisição</label>
              <input
                type="date"
                name="dataRequisicao"
                value={newRequest.dataRequisicao}
                disabled
              />
              
              <label htmlFor="dataEntrega">Data de Entrega</label>
              <input
                type="date"
                name="dataEntrega"
                value={newRequest.dataEntrega}
                onChange={handleInputChange}
                required
              />
              
              <div className="medicamento-form">
                <label htmlFor="medicamentoID">Medicamento</label>
                <select
                  name="medicamentoID"
                  value={newRequest.medicamentoID}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>
                    Selecione um Medicamento
                  </option>
                  {medicamentosList.map((med) => (
                    <option key={med.medicamentoID} value={med.medicamentoID}>
                      {med.nomeMedicamento}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  name="quantidade"
                  value={newRequest.quantidade}
                  onChange={handleInputChange}
                  placeholder="Quantidade"
                  required
                />
              </div>
              <button type="submit">Criar Requisição</button>
              <button type="button" onClick={() => setShowCreateForm(false)}>
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Request;
