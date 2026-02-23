import React, { useState } from 'react';
import './AddCar.css';

const API_BASE_URL = 'http://localhost:3001/api';

const AddCar = ({ onCarAdded }) => {
  const [companyName, setCompanyName] = useState('');
  const [modelName, setModelName] = useState('');
  const [year, setYear] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/cars`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName,
          modelName,
          year: year || null,
          imageUrl: imageUrl || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Car added successfully!');
        setCompanyName('');
        setModelName('');
        setYear('');
        setImageUrl('');
        onCarAdded();
      } else {
        setMessage(data.error || 'Failed to add car');
      }
    } catch (error) {
      setMessage('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-car">
      <h2>Add New Car</h2>
      <form onSubmit={handleSubmit} className="add-car-form">
        <div className="form-group">
          <label htmlFor="companyName">Company Name:</label>
          <input
            type="text"
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            placeholder="e.g., Toyota"
          />
        </div>
        <div className="form-group">
          <label htmlFor="modelName">Model Name:</label>
          <input
            type="text"
            id="modelName"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            required
            placeholder="e.g., Corolla"
          />
        </div>
        <div className="form-group">
          <label htmlFor="year">Year:</label>
          <input
            type="number"
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            min="1900"
            max={new Date().getFullYear() + 1}
            required
            placeholder="e.g., 2017"
          />
        </div>
        <div className="form-group">
          <label htmlFor="imageUrl">Image URL (optional):</label>
          <input
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/car-image.jpg"
          />
        </div>
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Adding...' : 'Add Car'}
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

export default AddCar;
