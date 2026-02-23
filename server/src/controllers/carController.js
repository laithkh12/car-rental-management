const { loadFleet, saveFleet } = require('../data/dataService');
const Car = require('../models/Car');

let fleet = loadFleet();

// Reload fleet on each request to ensure fresh data
function reloadFleet() {
  fleet = loadFleet();
}

const carController = {
  getAllCars: (req, res) => {
    reloadFleet();
    res.json(fleet.cars);
  },

  addCar: (req, res) => {
    reloadFleet();
    const { companyName, modelName, imageUrl, year } = req.body;
    
    if (!companyName || !modelName || !year) {
      return res.status(400).json({ error: 'Company name, model name, and year are required' });
    }
    
    // Validate year is a valid number
    const yearNum = parseInt(year);
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear() + 1) {
      return res.status(400).json({ error: 'Year must be a valid number between 1900 and ' + (new Date().getFullYear() + 1) });
    }

    // Check if car with same model name already exists
    const existingCar = fleet.cars.find(c => c.modelName === modelName);
    if (existingCar) {
      return res.status(400).json({ error: 'Car with this model name already exists' });
    }

    const newCar = new Car(companyName, modelName, imageUrl || null, yearNum);
    fleet.addCar(newCar);
    
    if (saveFleet(fleet)) {
      res.status(201).json(newCar);
    } else {
      res.status(500).json({ error: 'Failed to save car' });
    }
  },

  getAvailableCars: (req, res) => {
    reloadFleet();
    const availableCars = fleet.printAvailableCars();
    res.json(availableCars);
  },

  getHighestMileageCar: (req, res) => {
    reloadFleet();
    const highestMileageCar = fleet.getCarWithHighestMileage();
    
    if (!highestMileageCar) {
      return res.status(404).json({ error: 'No cars in fleet' });
    }
    
    res.json(highestMileageCar);
  },

  toggleCarAvailability: (req, res) => {
    try {
      reloadFleet();
      const { modelName, rentalEndDate } = req.body;
      
      console.log('Toggle availability request for:', modelName, 'rentalEndDate:', rentalEndDate);
      
      if (!modelName) {
        return res.status(400).json({ error: 'Model name is required' });
      }

      const car = fleet.cars.find(c => c.modelName === modelName);
      if (!car) {
        return res.status(404).json({ error: 'Car not found' });
      }

      // Toggle availability
      car.isAvailable = !car.isAvailable;
      
      // Set rental end date if provided and car is being marked as rented
      if (!car.isAvailable && rentalEndDate) {
        car.rentalEndDate = rentalEndDate;
      } else if (car.isAvailable) {
        // Clear rental end date when marking as available
        car.rentalEndDate = null;
      }
      
      console.log(`Car ${modelName} availability changed to: ${car.isAvailable}, rentalEndDate: ${car.rentalEndDate}`);
      
      if (saveFleet(fleet)) {
        res.json(car);
      } else {
        res.status(500).json({ error: 'Failed to update car availability' });
      }
    } catch (error) {
      console.error('Error in toggleCarAvailability:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  deleteCar: (req, res) => {
    try {
      reloadFleet();
      const { modelName } = req.params;
      
      console.log('Delete car request for:', modelName);
      
      if (!modelName) {
        return res.status(400).json({ error: 'Model name is required' });
      }

      const carIndex = fleet.cars.findIndex(c => c.modelName === modelName);
      if (carIndex === -1) {
        return res.status(404).json({ error: 'Car not found' });
      }

      // Remove car from fleet
      fleet.cars.splice(carIndex, 1);
      console.log(`Car ${modelName} deleted`);
      
      if (saveFleet(fleet)) {
        res.json({ message: 'Car deleted successfully', modelName });
      } else {
        res.status(500).json({ error: 'Failed to delete car' });
      }
    } catch (error) {
      console.error('Error in deleteCar:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  toggleMaintenance: (req, res) => {
    try {
      reloadFleet();
      const { modelName, maintenanceDate } = req.body;
      
      console.log('Toggle maintenance request for:', modelName, 'maintenanceDate:', maintenanceDate);
      
      if (!modelName) {
        return res.status(400).json({ error: 'Model name is required' });
      }

      const car = fleet.cars.find(c => c.modelName === modelName);
      if (!car) {
        return res.status(404).json({ error: 'Car not found' });
      }

      // Toggle maintenance status
      car.isInMaintenance = !car.isInMaintenance;
      
      // Set maintenance date if provided and car is being marked as in maintenance
      if (car.isInMaintenance && maintenanceDate) {
        car.maintenanceDate = maintenanceDate;
      } else if (!car.isInMaintenance) {
        // Clear maintenance date when marking as not in maintenance
        car.maintenanceDate = null;
      }
      
      console.log(`Car ${modelName} maintenance status changed to: ${car.isInMaintenance}, maintenanceDate: ${car.maintenanceDate}`);
      
      if (saveFleet(fleet)) {
        res.json(car);
      } else {
        res.status(500).json({ error: 'Failed to update car maintenance status' });
      }
    } catch (error) {
      console.error('Error in toggleMaintenance:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = carController;
