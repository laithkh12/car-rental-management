const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

router.get('/', carController.getAllCars);
router.post('/', carController.addCar);
router.get('/available', carController.getAvailableCars);
router.get('/highest-mileage', carController.getHighestMileageCar);
router.put('/toggle-availability', carController.toggleCarAvailability);
router.put('/toggle-maintenance', carController.toggleMaintenance);
router.delete('/:modelName', carController.deleteCar);

module.exports = router;
