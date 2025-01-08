import React, { useState, useEffect } from 'react';
import Toolbar from '../Toolbar'; // Toolbar component
import './Request.css';

const Request = () => {
  const [requisicoes, setRequisicoes] = useState([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    estadoID: '',
    profissionalID: '',
    adminID: '',
    aprovadoPorAdministrador: false,
    requisicaoCompleta: false,
    dataRequisicao: '',
    dataEntrega: '',
    medicamentos: [],
  });
  const [medicamento, setMedicamento] = useState({ medicamentoID: '', quantidade: '' });
  const [medicamentosList, setMedicamentosList] = useState([]);

  useEffect(() => {
    const fetchRequisicoes = async () => {
      try {
        const allRequests = [];
        for (let i = 1; i <= 10; i++) {
          try {
            const response = await fetch(`http://4.211.87.132:5000/api/requests/list/${i}`, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
              mode: 'cors',
            });
            if (!response.ok) {
              throw new Error(`Failed to fetch data for service ID: ${i}`);
            }
            const data = await response.json();
            allRequests.push(...data);
          } catch (err) {
            console.error(err);
          }
        }
        setRequisicoes(allRequests);
      } catch (err) {
        setError('Failed to load requisicoes data');
      }
    };

    fetchRequisicoes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleMedicamentoChange = (e) => {
    const { name, value } = e.target;
    setMedicamento({
      ...medicamento,
      [name]: value,
    });
  };

  const addMedicamento = () => {
    if (medicamento.medicamentoID && medicamento.quantidade) {
      setFormData({
        ...formData,
        medicamentos: [...formData.medicamentos, medicamento],
      });
      setMedicamento({ medicamentoID: '', quantidade: '' }); // Reset medicamento form
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://4.211.87.132:5000/api/request/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to create request');
      }
      const newRequest = await response.json();
      setRequisicoes([...requisicoes, newRequest]);
      setShowForm(false);
      setFormData({
        estadoID: '',
        profissionalID: '',
        adminID: '',
        aprovadoPorAdministrador: false,
        requisicaoCompleta: false,
        dataRequisicao: '',
        dataEntrega: '',
        medicamentos: [],
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) {
      return 'Data Inválida';
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="requests-page">
      <Toolbar
        name="Requisições"
        buttonLabel="Nova Requisição"
        onButtonClick={() => setShowForm(!showForm)}
      />
      <div className="requests-content">
        {error && <p>{error}</p>}
        {showForm && (
          <form className="request-form" onSubmit={handleFormSubmit}>
            <input
              type="text"
              name="estadoID"
              placeholder="Estado ID"
              value={formData.estadoID}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="profissionalID"
              placeholder="Profissional ID"
              value={formData.profissionalID}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="adminID"
              placeholder="Admin ID"
              value={formData.adminID}
              onChange={handleInputChange}
              required
            />
            <label>
              Aprovado:
              <input
                type="checkbox"
                name="aprovadoPorAdministrador"
                checked={formData.aprovadoPorAdministrador}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Completo:
              <input
                type="checkbox"
                name="requisicaoCompleta"
                checked={formData.requisicaoCompleta}
                onChange={handleInputChange}
              />
            </label>
            <input
              type="date"
              name="dataRequisicao"
              value={formData.dataRequisicao}
              onChange={handleInputChange}
              required
            />
            <input
              type="date"
              name="dataEntrega"
              value={formData.dataEntrega}
              onChange={handleInputChange}
              required
            />

            {/* Medication Section */}
            <div className="medicamento-form">
              <input
                type="text"
                name="medicamentoID"
                value={medicamento.medicamentoID}
                onChange={handleMedicamentoChange}
                placeholder="Medicamento ID"
                required
              />
              <input
                type="number"
                name="quantidade"
                value={medicamento.quantidade}
                onChange={handleMedicamentoChange}
                placeholder="Quantidade"
                required
              />
              <button type="button" onClick={addMedicamento}>
                Adicionar Medicamento
              </button>
            </div>

            <button type="submit">Salvar</button>
          </form>
        )}
        {requisicoes.length > 0 ? (
          <div className="requests-table-container">
            <div className="requests-table-header">
              <div className="column">#</div>
              <div className="column">Profissional</div>
              <div className="column">Data da Requisição</div>
              <div className="column">Aprovado</div>
              <div className="column">Data de Entrega</div>
              <div className="column">Medicamentos</div>
            </div>
            {requisicoes.map((requisicao, index) => (
              <div className="requests-table-row" key={index}>
                <div className="column">{requisicao.requisicaoid}</div>
                <div className="column">
                  {requisicao.nomeproprio} {requisicao.ultimonome}
                </div>
                <div className="column">{formatDate(requisicao.datarequisicao)}</div>
                <div className="column">{requisicao.aprovadoporadministrador ? 'Sim' : 'Não'}</div>
                <div className="column">{formatDate(requisicao.dataentrega)}</div>
                <div className="column">
                  {requisicao.medicamentos && requisicao.medicamentos.length > 0
                    ? requisicao.medicamentos.map((med) => (
                        <div key={med.medicamentoID}>
                          {med.nomeMedicamento} - {med.quantidade}
                        </div>
                      ))
                    : 'Nenhum medicamento'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Não há requisições para exibir.</p>
        )}
      </div>
    </div>
  );
};

export default Request;
