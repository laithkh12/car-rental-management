import React, { useState } from 'react';
import './AddTrip.css';

const API_BASE_URL = 'http://localhost:3001/api';

const AddTrip = ({ onTripAdded, cars }) => {
  const [carModelName, setCarModelName] = useState('');
  const [renterName, setRenterName] = useState('');
  const [date, setDate] = useState('');
  const [kilometers, setKilometers] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!carModelName || !renterName || !date || !kilometers) {
      setMessage('All fields are required');
      setLoading(false);
      return;
    }

    const kmValue = parseFloat(kilometers);
    if (isNaN(kmValue) || kmValue < 0) {
      setMessage('Kilometers must be a non-negative number');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/trips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          carModelName,
          renterName,
          date,
          kilometers: kmValue,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Trip added successfully!');
        setCarModelName('');
        setRenterName('');
        setDate('');
        setKilometers('');
        onTripAdded();
      } else {
        setMessage(data.error || 'Failed to add trip');
      }
    } catch (error) {
      setMessage('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-trip">
      <h2>Add Trip to Car</h2>
      <form onSubmit={handleSubmit} className="add-trip-form">
        <div className="form-group">
          <label htmlFor="carModelName">Car Model Name:</label>
          <input
            type="text"
            id="carModelName"
            value={carModelName}
            onChange={(e) => setCarModelName(e.target.value)}
            list="carModels"
            required
            placeholder="Enter or select car model"
          />
          <datalist id="carModels">
            {cars.map((car, index) => (
              <option key={index} value={car.modelName} />
            ))}
          </datalist>
        </div>
        <div className="form-group">
          <label htmlFor="renterName">Renter Name:</label>
          <input
            type="text"
            id="renterName"
            value={renterName}
            onChange={(e) => setRenterName(e.target.value)}
            required
            placeholder="e.g., John Doe"
          />
        </div>
        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="kilometers">Kilometers:</label>
          <input
            type="number"
            id="kilometers"
            value={kilometers}
            onChange={(e) => setKilometers(e.target.value)}
            min="0"
            step="0.1"
            required
            placeholder="e.g., 150"
          />
        </div>
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Adding...' : 'Add Trip'}
        </button>
        {message && (
          <p className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default AddTrip;
