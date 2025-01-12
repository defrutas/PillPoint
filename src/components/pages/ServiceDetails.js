import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ServiceDetails.css";

const ServiceDetails = () => {
  const { id } = useParams(); // Extract 'id' from the URL
  const [service, setService] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServiceAndMedicines = async () => {
      try {
        // Fetch all services
        const serviceResponse = await fetch("http://4.211.87.132:5000/api/services/all");
        if (!serviceResponse.ok) {
          throw new Error("Failed to fetch all services");
        }
        const servicesData = await serviceResponse.json();
        const selectedService = servicesData.find(
          (servico) => servico.servicoID === parseInt(id, 10)
        );
        if (!selectedService) {
          throw new Error("Service not found");
        }
        setService(selectedService);

        // Fetch medicines for the selected service
        const medicinesResponse = await fetch("http://4.211.87.132:5000/api/notifications");
        if (!medicinesResponse.ok) {
          throw new Error("Failed to fetch medicines");
        }
        const medicinesData = await medicinesResponse.json();
        console.log("Medicines data:", medicinesData); // Debugging log

        // Handle the case where medicinesData might not be an array
        const medicinesArray = Array.isArray(medicinesData) ? medicinesData : [];
        const relatedMedicines = medicinesArray.filter(
          (med) => med.servicoID === parseInt(id, 10)
        );
        setMedicines(relatedMedicines);
      } catch (err) {
        setError(err.message || "Could not fetch service details");
        console.error(err);
      }
    };

    fetchServiceAndMedicines();
  }, [id]);

  // Error message handling
  if (error) {
    return <p className="error-message">{error}</p>;
  }

  // Loading state
  if (!service) {
    return <p>Loading...</p>;
  }

  // Service and medicines rendering
  return (
    <div className="service-details-container mt-20 px-4 py-8 max-w-4xl mx-auto">
      {/* Main container for the service details */}
      <div className="service-info">
        {/* Title */}
        <h1 className="service-title">{service.nomeServico}</h1>

        {/* Service Details */}
        <div className="service-details">
          <p><strong>Label:</strong> {service.descServico}</p>
          <p><strong>Location:</strong> {service.localidadeServico}</p>
          <p><strong>Available 24h:</strong> {service.servicoDisponivel24horas ? "Yes" : "No"}</p>
        </div>
      </div>

      {/* Medicines list */}
      <h2 className="medicines-header">Medicines Available in {service.nomeServico}</h2>
      {medicines.length > 0 ? (
        <div className="medicines-list">
          {medicines.map((med) => (
            <div key={med.medicamentoID} className="medicine-card">
              <h3 className="medicine-title">{med.nomeMedicamento}</h3>
              <p>{med.tipoMedicamento}</p>
              <p><strong>Available:</strong> {med.quantidadeDisponivel}</p>
              <p><strong>Minimum Stock:</strong> {med.quantidadeMinima}</p>
              {med.quantidadeDisponivel < med.quantidadeMinima && (
                <span className="low-stock">Low Stock</span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No medicines available for this service.</p>
      )}
    </div>
  );
};

export default ServiceDetails;
