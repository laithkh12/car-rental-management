import React, { useState, useEffect } from 'react';
import './RentedCars.css';

const API_BASE_URL = 'http://localhost:3001/api';

const RentedCars = ({ refreshTrigger }) => {
  const [rentedCars, setRentedCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRentedCars();
  }, [refreshTrigger]);

  const fetchRentedCars = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/cars`);
      if (response.ok) {
        const data = await response.json();
        // Filter only rented cars (isAvailable === false)
        const rented = data.filter(car => car.isAvailable === false);
        setRentedCars(rented);
      }
    } catch (error) {
      console.error('Error fetching rented cars:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="rented-cars">
        <h2>Rented Cars</h2>
        <p>Loading...</p>
      </div>
    );
  }

  if (rentedCars.length === 0) {
    return (
      <div className="rented-cars">
        <h2>Rented Cars</h2>
        <p className="no-cars">No rented cars at the moment.</p>
      </div>
    );
  }

  return (
    <div className="rented-cars">
      <h2>Rented Cars</h2>
      <div className="cars-grid">
        {rentedCars.map((car, index) => (
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
              {car.rentalEndDate && (
                <p><strong>Rental End Date:</strong> 
                  <span className="rental-end-date">
                    {new Date(car.rentalEndDate).toLocaleDateString('en-US', {
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

export default RentedCars;
