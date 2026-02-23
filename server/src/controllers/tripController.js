const { loadFleet, saveFleet } = require('../data/dataService');
const Trip = require('../models/Trip');

let fleet = loadFleet();

// Reload fleet on each request to ensure fresh data
function reloadFleet() {
  fleet = loadFleet();
}

const tripController = {
  addTripToCar: (req, res) => {
    reloadFleet();
    const { carModelName, renterName, date, kilometers } = req.body;
    
    if (!carModelName || !renterName || !date || kilometers === undefined) {
      return res.status(400).json({ 
        error: 'Car model name, renter name, date, and kilometers are required' 
      });
    }

    if (typeof kilometers !== 'number' || kilometers < 0) {
      return res.status(400).json({ error: 'Kilometers must be a non-negative number' });
    }

    try {
      const trip = new Trip(renterName, date, kilometers);
      fleet.addTripToCar(carModelName, trip);
      
      if (saveFleet(fleet)) {
        // Return the updated car
        const updatedCar = fleet.cars.find(c => c.modelName === carModelName);
        res.status(201).json(updatedCar);
      } else {
        res.status(500).json({ error: 'Failed to save trip' });
      }
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
};

module.exports = tripController;
