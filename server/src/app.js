const express = require('express');
const cors = require('cors');
const carRoutes = require('./routes/carRoutes');
const tripRoutes = require('./routes/tripRoutes');
const { loadFleet } = require('./data/dataService');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database on startup
loadFleet();

// Routes
app.use('/api/cars', carRoutes);
app.use('/api/trips', tripRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

module.exports = app;
