const Trip = require('./Trip');

class Car {
  constructor(companyName, modelName, imageUrl = null, year = null) {
    this.companyName = companyName;
    this.modelName = modelName;
    this.isAvailable = true;
    this.totalKilometers = 0;
    this.trips = [];
    this.rentalEndDate = null;
    this.imageUrl = imageUrl;
    this.year = year;
    this.isInMaintenance = false;
    this.maintenanceDate = null;
  }

  recalculateTotalKilometers() {
    this.totalKilometers = this.trips.reduce((total, trip) => {
      return total + trip.kilometers;
    }, 0);
  }

  addTrip(trip) {
    if (!(trip instanceof Trip)) {
      throw new Error('Trip must be an instance of Trip class');
    }
    this.trips.push(trip);
    this.recalculateTotalKilometers();
  }
}

module.exports = Car;
