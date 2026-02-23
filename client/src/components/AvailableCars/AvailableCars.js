import React, { useState, useEffect } from 'react';
import './AvailableCars.css';

const API_BASE_URL = 'http://localhost:3001/api';

const AvailableCars = ({ refreshTrigger }) => {
  const [availableCars, setAvailableCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvailableCars();
  }, [refreshTrigger]);

  const fetchAvailableCars = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/cars/available`);
      if (response.ok) {
        const data = await response.json();
        setAvailableCars(data);
      }
    } catch (error) {
      console.error('Error fetching available cars:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="available-cars">
        <h2>Available Cars</h2>
        <p>Loading...</p>
      </div>
    );
  }

  if (availableCars.length === 0) {
    return (
      <div className="available-cars">
        <h2>Available Cars</h2>
        <p className="no-cars">No available cars at the moment.</p>
      </div>
    );
  }

  return (
    <div className="available-cars">
      <h2>Available Cars</h2>
      <div className="cars-grid">
        {availableCars.map((car, index) => (
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
              <p><strong>Total Kilometers:</strong> {car.totalKilometers.toLocaleString()} km</p>
              <p><strong>Trips:</strong> {car.trips ? car.trips.length : 0}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableCars;
