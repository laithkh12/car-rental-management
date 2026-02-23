import React, { useState, useEffect } from 'react';
import './App.css';
import CarList from './components/CarList/CarList';
import AddCar from './components/AddCar/AddCar';
import AddTrip from './components/AddTrip/AddTrip';
import AvailableCars from './components/AvailableCars/AvailableCars';
import RentedCars from './components/RentedCars/RentedCars';
import MaintenanceCars from './components/MaintenanceCars/MaintenanceCars';
import HighestMileageCar from './components/HighestMileageCar/HighestMileageCar';

const API_BASE_URL = 'http://localhost:3001/api';

function App() {
  const [cars, setCars] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchCars = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cars`);
      if (response.ok) {
        const data = await response.json();
        setCars(data);
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [refreshTrigger]);

  const handleDataChange = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Car Rental Management System</h1>
      </header>
      <main className="App-main">
        <div className="App-section">
          <AddCar onCarAdded={handleDataChange} />
        </div>
        <div className="App-section">
          <AddTrip onTripAdded={handleDataChange} cars={cars} />
        </div>
        <div className="App-section">
          <CarList cars={cars} onDataChange={handleDataChange} />
        </div>
        <div className="App-section">
          <AvailableCars refreshTrigger={refreshTrigger} />
        </div>
        <div className="App-section">
          <RentedCars refreshTrigger={refreshTrigger} />
        </div>
        <div className="App-section">
          <MaintenanceCars refreshTrigger={refreshTrigger} />
        </div>
        <div className="App-section">
          <HighestMileageCar refreshTrigger={refreshTrigger} />
        </div>
      </main>
    </div>
  );
}

export default App;
