import React from 'react';
import { Link } from 'react-router-dom'; // Using react-router-dom for routing
import './Sidebar.css'; // Import the CSS for the sidebar

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to="/home" className="sidebar-link">
        Página Inicial
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
      </Link>
      <Link to="/contacts" className="sidebar-link">
        Contactos
      </Link>
    </div>
  );
};

export default Sidebar;
