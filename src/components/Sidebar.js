import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    const fetchAlertCounts = async () => {
      try {
        const response = await fetch('http://4.211.87.132:5000/api/notifications');
        if (!response.ok) {
          throw new Error('Failed to fetch alert data');
        }
        const data = await response.json();
        console.log("Fetched alert data:", data);

        let totalCount = 0;

        // Helper function to check if a string contains a number
        const extractNumberFromString = (str) => {
          const match = str.match(/\d+/);  // Extracts the first number in a string
          return match ? parseInt(match[0], 10) : 0;
        };

        // Check if medications, orders, or requests are arrays or strings
        if (Array.isArray(data.medications)) {
          totalCount += data.medications.length;
        } else if (typeof data.medications === 'string') {
          totalCount += extractNumberFromString(data.medications);
        }

        if (Array.isArray(data.orders)) {
          totalCount += data.orders.length;
        } else if (typeof data.orders === 'string') {
          totalCount += extractNumberFromString(data.orders);
        }

        if (Array.isArray(data.requests)) {
          totalCount += data.requests.length;
        } else if (typeof data.requests === 'string') {
          totalCount += extractNumberFromString(data.requests);
        }

        setAlertCount(totalCount);
      } catch (error) {
        console.error('Error fetching alert count:', error);
      }
    };

    fetchAlertCounts();
  }, []);

  return (
    <div className="sidebar">
      <Link to="/home" className="sidebar-link">
        Página Inicial
      </Link>
      <Link to="/services" className="sidebar-link">
        Serviços Hospitalares
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
