import React, { useState, useEffect } from 'react';
import './MaintenanceCars.css';

const API_BASE_URL = 'http://localhost:3001/api';

const MaintenanceCars = ({ refreshTrigger }) => {
  const [maintenanceCars, setMaintenanceCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaintenanceCars();
  }, [refreshTrigger]);

  const fetchMaintenanceCars = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/cars`);
      if (response.ok) {
        const data = await response.json();
        // Filter only cars in maintenance
        const maintenance = data.filter(car => car.isInMaintenance === true);
        setMaintenanceCars(maintenance);
      }
    } catch (error) {
      console.error('Error fetching maintenance cars:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="maintenance-cars">
        <h2>Cars in Maintenance</h2>
        <p>Loading...</p>
      </div>
    );
  }

  if (maintenanceCars.length === 0) {
    return (
      <div className="maintenance-cars">
        <h2>Cars in Maintenance</h2>
        <p className="no-cars">No cars in maintenance at the moment.</p>
      </div>
    );
  }

  return (
    <div className="maintenance-cars">
      <h2>Cars in Maintenance</h2>
      <div className="cars-grid">
        {maintenanceCars.map((car, index) => (
          <div key={index} className="car-card">
            {car.imageUrl && (
              <div className="car-image-container">
                <img src={car.imageUrl} alt={`${car.companyName} ${car.modelName}`} className="car-image" />
              </div>
            )}
            <div className="car-card-header">
              <h3>{car.modelName}{car.year && ` (${car.year})`}</h3>
              <span className="company-badge">{car.companyName}</span>
            </div>
            <div className="car-card-body">
              {car.maintenanceDate && (
                <p><strong>Maintenance Date:</strong> 
                  <span className="maintenance-date">
                    {new Date(car.maintenanceDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </p>
              )}
              <p><strong>Total Kilometers:</strong> {car.totalKilometers.toLocaleString()} km</p>
              <p><strong>Trips:</strong> {car.trips ? car.trips.length : 0}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaintenanceCars;
