const Car = require('./Car');

class CompanyFleet {
  constructor(rentalCompanyName) {
    this.rentalCompanyName = rentalCompanyName;
    this.cars = [];
  }

  addCar(car) {
    if (!(car instanceof Car)) {
      throw new Error('Car must be an instance of Car class');
    }
    this.cars.push(car);
  }

  getCarWithHighestMileage() {
    if (this.cars.length === 0) {
      return null;
    }
    return this.cars.reduce((highest, car) => {
      return car.totalKilometers > highest.totalKilometers ? car : highest;
    }, this.cars[0]);
  }

  printAvailableCars() {
    return this.cars.filter(car => car.isAvailable === true && car.isInMaintenance === false);
  }

  addTripToCar(carModelName, trip) {
    const car = this.cars.find(c => c.modelName === carModelName);
    if (!car) {
      throw new Error(`Car with model name "${carModelName}" not found`);
    }
    car.addTrip(trip);
  }
}

module.exports = CompanyFleet;
