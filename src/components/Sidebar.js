import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    const baseURL = "http://4.211.87.132:5000";
    fetch(`${baseURL}/api/checkDatabase/check`)
      .then((response) => response.json())
      .then((data) => setAlertCount(data.length))
      .catch((error) => console.error("Error fetching alert count:", error));
  }, []);

  return (
    <div className="sidebar">
      <Link to="/home" className="sidebar-link">
        Página Inicial
      </Link>
      <Link to="/services" className="sidebar-link">
        Serviços de Saúde
      </Link>
      <Link to="/product" className="sidebar-link">
        Medicamentos
      </Link>
      <Link to="/requests" className="sidebar-link">
        Requisições
      </Link>
      <Link to="/encomendas" className="sidebar-link">
        Encomendas
      </Link>
      <Link to="/alerts" className="sidebar-link">
        Alertas
        {alertCount > 0 && (
          <span className="alert-badge">{alertCount}</span>
        )}
      </Link>
      <Link to="/contacts" className="sidebar-link">
        Contactos
      </Link>
    </div>
  );
};

export default Sidebar;
