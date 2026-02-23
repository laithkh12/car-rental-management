import React, { useState, useEffect } from 'react';
import './HighestMileageCar.css';

const API_BASE_URL = 'http://localhost:3001/api';

const HighestMileageCar = ({ refreshTrigger }) => {
  const [highestMileageCar, setHighestMileageCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHighestMileageCar();
  }, [refreshTrigger]);

  const fetchHighestMileageCar = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/cars/highest-mileage`);
      if (response.ok) {
        const data = await response.json();
        setHighestMileageCar(data);
      } else if (response.status === 404) {
        setHighestMileageCar(null);
      }
    } catch (error) {
      console.error('Error fetching highest mileage car:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="highest-mileage-car">
        <h2>Highest Mileage Car</h2>
        <p>Loading...</p>
      </div>
    );
  }

  if (!highestMileageCar) {
    return (
      <div className="highest-mileage-car">
        <h2>Highest Mileage Car</h2>
        <p className="no-car">No cars in the fleet yet.</p>
      </div>
    );
  }

  return (
    <div className="highest-mileage-car">
      <h2>Highest Mileage Car</h2>
      <div className="car-highlight">
        <div className="car-highlight-content">
          <div className="car-highlight-text">
            <div className="car-highlight-header">
              <h3>{highestMileageCar.modelName}{highestMileageCar.year && ` (${highestMileageCar.year})`}</h3>
              <span className="company-badge">{highestMileageCar.companyName}</span>
            </div>
            <div className="car-highlight-body">
              <div className="mileage-display">
                <span className="mileage-value">{highestMileageCar.totalKilometers.toLocaleString()}</span>
                <span className="mileage-unit">km</span>
              </div>
              <div className="car-details">
                <p><strong>Status:</strong> 
                  <span className={`status-badge ${highestMileageCar.isAvailable ? 'available' : 'rented'}`}>
                    {highestMileageCar.isAvailable ? 'Available' : 'Rented'}
                  </span>
                </p>
                {!highestMileageCar.isAvailable && highestMileageCar.rentalEndDate && (
                  <p><strong>Rental End Date:</strong> 
                    <span className="rental-end-date">
                      {new Date(highestMileageCar.rentalEndDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </p>
                )}
                <p><strong>Total Trips:</strong> {highestMileageCar.trips ? highestMileageCar.trips.length : 0}</p>
              </div>
            </div>
          </div>
          {highestMileageCar.imageUrl && (
            <div className="car-highlight-image-container">
              <img src={highestMileageCar.imageUrl} alt={`${highestMileageCar.companyName} ${highestMileageCar.modelName}`} className="car-highlight-image" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HighestMileageCar;
