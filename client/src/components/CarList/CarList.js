import React, { useState } from 'react';
import './CarList.css';

const API_BASE_URL = 'http://localhost:3001/api';

const CarList = ({ cars, onDataChange }) => {
  const [updating, setUpdating] = useState({});
  const [deleting, setDeleting] = useState({});
  const [showDateInput, setShowDateInput] = useState({});
  const [rentalEndDates, setRentalEndDates] = useState({});
  const [showMaintenanceDateInput, setShowMaintenanceDateInput] = useState({});
  const [maintenanceDates, setMaintenanceDates] = useState({});
  if (!cars || cars.length === 0) {
    return (
      <div className="car-list">
        <h2>All Cars</h2>
        <p className="no-cars">No cars in the fleet yet.</p>
      </div>
    );
  }

  const handleToggleAvailability = async (modelName, isCurrentlyAvailable) => {
    // If marking as rented, show date input first
    if (isCurrentlyAvailable) {
      setShowDateInput(prev => ({ ...prev, [modelName]: true }));
      return;
    }
    
    // If marking as available, proceed without date
    await submitToggleAvailability(modelName, null);
  };

  const handleDateSubmit = async (modelName, e) => {
    e.preventDefault();
    const rentalEndDate = rentalEndDates[modelName];
    if (!rentalEndDate) {
      alert('Please enter a rental end date');
      return;
    }
    await submitToggleAvailability(modelName, rentalEndDate);
  };

  const submitToggleAvailability = async (modelName, rentalEndDate) => {
    setUpdating(prev => ({ ...prev, [modelName]: true }));
    setShowDateInput(prev => ({ ...prev, [modelName]: false }));
    
    try {
      console.log('Toggling availability for:', modelName, 'rentalEndDate:', rentalEndDate);
      const response = await fetch(`${API_BASE_URL}/cars/toggle-availability`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ modelName, rentalEndDate }),
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Car updated:', data);
        if (onDataChange) {
          onDataChange();
        }
      } else {
        const data = await response.json();
        console.error('Error response:', data);
        alert(data.error || 'Failed to update car availability');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert(`Error connecting to server: ${error.message}\n\nMake sure:\n1. Backend server is running on port 3001\n2. Run: cd server && npm start`);
    } finally {
      setUpdating(prev => ({ ...prev, [modelName]: false }));
    }
  };

  const handleDeleteCar = async (modelName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${modelName}?\n\nThis action cannot be undone and will delete all associated trips.`
    );

    if (!confirmDelete) {
      return;
    }

    setDeleting(prev => ({ ...prev, [modelName]: true }));
    
    try {
      console.log('Deleting car:', modelName);
      const response = await fetch(`${API_BASE_URL}/cars/${encodeURIComponent(modelName)}`, {
        method: 'DELETE',
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Car deleted:', data);
        if (onDataChange) {
          onDataChange();
        }
      } else {
        const data = await response.json();
        console.error('Error response:', data);
        alert(data.error || 'Failed to delete car');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert(`Error connecting to server: ${error.message}\n\nMake sure:\n1. Backend server is running on port 3001\n2. Run: cd server && npm start`);
    } finally {
      setDeleting(prev => ({ ...prev, [modelName]: false }));
    }
  };

  const handleToggleMaintenance = async (modelName, isCurrentlyInMaintenance) => {
    // If marking as in maintenance, show date input first
    if (!isCurrentlyInMaintenance) {
      setShowMaintenanceDateInput(prev => ({ ...prev, [modelName]: true }));
      return;
    }
    
    // If marking as not in maintenance, proceed without date
    await submitToggleMaintenance(modelName, null);
  };

  const handleMaintenanceDateSubmit = async (modelName, e) => {
    e.preventDefault();
    const maintenanceDate = maintenanceDates[modelName];
    if (!maintenanceDate) {
      alert('Please enter a maintenance date');
      return;
    }
    await submitToggleMaintenance(modelName, maintenanceDate);
  };

  const submitToggleMaintenance = async (modelName, maintenanceDate) => {
    setUpdating(prev => ({ ...prev, [modelName]: true }));
    setShowMaintenanceDateInput(prev => ({ ...prev, [modelName]: false }));
    
    try {
      console.log('Toggling maintenance for:', modelName, 'maintenanceDate:', maintenanceDate);
      const response = await fetch(`${API_BASE_URL}/cars/toggle-maintenance`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ modelName, maintenanceDate }),
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Car updated:', data);
        if (onDataChange) {
          onDataChange();
        }
      } else {
        const data = await response.json();
        console.error('Error response:', data);
        alert(data.error || 'Failed to update car maintenance status');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert(`Error connecting to server: ${error.message}\n\nMake sure:\n1. Backend server is running on port 3001\n2. Run: cd server && npm start`);
    } finally {
      setUpdating(prev => ({ ...prev, [modelName]: false }));
    }
  };

  return (
    <div className="car-list">
      <h2>All Cars</h2>
      <div className="car-table-container">
        <table className="car-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Model</th>
              <th>Status</th>
              <th>Total Kilometers</th>
              <th>Number of Trips</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car, index) => (
              <tr key={index}>
                <td>{car.companyName}</td>
                <td>{car.modelName}{car.year && ` (${car.year})`}</td>
                <td>
                  {car.isInMaintenance ? (
                    <span className="status-badge maintenance">In Maintenance</span>
                  ) : (
                    <span className={`status-badge ${car.isAvailable ? 'available' : 'rented'}`}>
                      {car.isAvailable ? 'Available' : 'Rented'}
                    </span>
                  )}
                </td>
                <td>{car.totalKilometers.toLocaleString()} km</td>
                <td>{car.trips ? car.trips.length : 0}</td>
                <td>
                  <div className="actions-cell">
                    {showDateInput[car.modelName] ? (
                      <form onSubmit={(e) => handleDateSubmit(car.modelName, e)} className="rental-date-form">
                        <input
                          type="date"
                          value={rentalEndDates[car.modelName] || ''}
                          onChange={(e) => setRentalEndDates(prev => ({ ...prev, [car.modelName]: e.target.value }))}
                          required
                          className="rental-date-input"
                        />
                        <div className="date-form-buttons">
                          <button type="submit" className="date-submit-button">Set</button>
                          <button 
                            type="button" 
                            onClick={() => setShowDateInput(prev => ({ ...prev, [car.modelName]: false }))}
                            className="date-cancel-button"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : showMaintenanceDateInput[car.modelName] ? (
                      <form onSubmit={(e) => handleMaintenanceDateSubmit(car.modelName, e)} className="rental-date-form">
                        <input
                          type="date"
                          value={maintenanceDates[car.modelName] || ''}
                          onChange={(e) => setMaintenanceDates(prev => ({ ...prev, [car.modelName]: e.target.value }))}
                          required
                          className="rental-date-input"
                        />
                        <div className="date-form-buttons">
                          <button type="submit" className="date-submit-button">Set</button>
                          <button 
                            type="button" 
                            onClick={() => setShowMaintenanceDateInput(prev => ({ ...prev, [car.modelName]: false }))}
                            className="date-cancel-button"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        {!car.isInMaintenance && (
                          <button
                            className={`toggle-button ${car.isAvailable ? 'make-unavailable' : 'make-available'}`}
                            onClick={() => handleToggleAvailability(car.modelName, car.isAvailable)}
                            disabled={updating[car.modelName] || deleting[car.modelName] || car.isInMaintenance}
                            title={car.isInMaintenance ? 'Cannot rent car in maintenance' : ''}
                          >
                            {updating[car.modelName] 
                              ? 'Updating...' 
                              : car.isAvailable 
                                ? 'Mark as Rented' 
                                : 'Mark as Available'}
                          </button>
                        )}
                        <button
                          className={`toggle-button ${car.isInMaintenance ? 'make-available' : 'maintenance-button'}`}
                          onClick={() => handleToggleMaintenance(car.modelName, car.isInMaintenance)}
                          disabled={updating[car.modelName] || deleting[car.modelName] || (!car.isAvailable && !car.isInMaintenance)}
                          title={!car.isAvailable && !car.isInMaintenance ? 'Cannot put rented car in maintenance' : ''}
                        >
                          {updating[car.modelName] 
                            ? 'Updating...' 
                            : car.isInMaintenance 
                              ? 'Remove from Maintenance' 
                              : 'Mark as Maintenance'}
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteCar(car.modelName)}
                          disabled={updating[car.modelName] || deleting[car.modelName] || !car.isAvailable || car.isInMaintenance}
                          title={!car.isAvailable || car.isInMaintenance ? 'Cannot delete car that is rented or in maintenance' : 'Delete car'}
                        >
                          {deleting[car.modelName] ? 'Deleting...' : 'Delete'}
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CarList;
