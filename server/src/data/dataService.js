const fs = require('fs');
const path = require('path');
const CompanyFleet = require('../models/CompanyFleet');
const Car = require('../models/Car');
const Trip = require('../models/Trip');

const DB_PATH = path.join(__dirname, 'database.json');

function loadFleet() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    const jsonData = JSON.parse(data);
    const fleet = new CompanyFleet(jsonData.rentalCompanyName);
    
    // Reconstruct cars from JSON
    jsonData.cars.forEach(carData => {
      const car = new Car(carData.companyName, carData.modelName, carData.imageUrl || null, carData.year || null);
      car.isAvailable = carData.isAvailable;
      car.totalKilometers = carData.totalKilometers;
      car.rentalEndDate = carData.rentalEndDate || null;
      car.isInMaintenance = carData.isInMaintenance || false;
      car.maintenanceDate = carData.maintenanceDate || null;
      
      // Reconstruct trips
      carData.trips.forEach(tripData => {
        const trip = new Trip(tripData.renterName, tripData.date, tripData.kilometers);
        car.trips.push(trip);
      });
      
      fleet.addCar(car);
    });
    
    return fleet;
  } catch (error) {
    // If file doesn't exist or is empty, create new fleet
    return new CompanyFleet('Car Rental Company');
  }
}

function saveFleet(fleet) {
  try {
    const jsonData = {
      rentalCompanyName: fleet.rentalCompanyName,
      cars: fleet.cars.map(car => ({
        companyName: car.companyName,
        modelName: car.modelName,
        isAvailable: car.isAvailable,
        totalKilometers: car.totalKilometers,
        rentalEndDate: car.rentalEndDate || null,
        imageUrl: car.imageUrl || null,
        year: car.year || null,
        isInMaintenance: car.isInMaintenance || false,
        maintenanceDate: car.maintenanceDate || null,
        trips: car.trips.map(trip => ({
          renterName: trip.renterName,
          date: trip.date,
          kilometers: trip.kilometers
        }))
      }))
    };
    
    fs.writeFileSync(DB_PATH, JSON.stringify(jsonData, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving fleet:', error);
    return false;
  }
}

module.exports = {
  loadFleet,
  saveFleet
};
