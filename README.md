# Car Rental Company Manager

A full‑stack project for managing a **car rental company**: cars, their availability status, and rental trips (rides).  
Built with **React + CSS + JavaScript** on the client and **Node.js + Express** on the server.

---

## What this project implements (based on the assignment)

### 1) `Trip` (נסיעה)
A trip represents one rental session.

**Constructor fields**
- `renterName` — שם המשכיר
- `date` — תאריך
- `kilometers` — מספר הקילומטרים שהרכב נסע במהלך ההשכרה

---

### 2) `Car` (רכב)
Represents a single car model in the fleet.

**Constructor fields**
- `companyName` — שם חברה
- `modelName` — שם המודל
- `isAvailable` — boolean: available or rented (**defaults to `true` on creation**)
- `totalKilometers` — total kilometers the car has driven
- `trips` — array of `Trip`

**Methods**
- `recalculateTotalKilometers()`  
  Loops through `trips`, sums kilometers, and updates `totalKilometers`.
- `addTrip(trip)`  
  Adds a `Trip` to `trips` and updates `totalKilometers after every new trip.

---

### 3) `CompanyFleet` / `AllCompanyCars` (כל רכבי החברה)
Manages all cars of the rental company.

**Constructor fields**
- `rentalCompanyName` — name of the rental company
- `cars` — array of `Car`

**Methods**
- `addCar(car)` — adds a new `Car` to the fleet
- `getCarWithHighestMileage()` — returns the car with the highest `totalKilometers`
- `printAvailableCars()` — prints/lists all cars available for rent
- `addTripToCar(carModelName, trip)`  
  Finds the car by model name and adds the trip to it (using `Car.addTrip`)

---

## Tech Stack

### Frontend
- React
- JavaScript
- CSS

### Backend
- Node.js
- Express

---

## Suggested Project Structure

```
car-rental-company-manager/
  client/                # React app
    src/
      components/
      pages/
      styles/
      api/
    package.json
  server/                # Express API
    src/
      models/            # Trip, Car, CompanyFleet classes
      routes/
      controllers/
      data/              # optional JSON storage
      app.js
    package.json
  README.md
```

---

## Getting Started

### 1) Clone
```bash
git clone <your-repo-url>
cd <your-repo-folder>
```

### 2) Install dependencies

#### Server
```bash
cd server
npm install
```

#### Client
```bash
cd ../client
npm install
```

---

## Run the Project (Dev)

### Start the server
```bash
cd server
npm run dev
```
If you don’t have a `dev` script, use:
```bash
npm start
```

### Start the client
```bash
cd client
npm start
```

---

## API (example endpoints)

You can implement the logic with these endpoints (feel free to change names):

### Cars
- `GET /api/cars` — list all cars
- `POST /api/cars` — add a new car
- `GET /api/cars/available` — list available cars
- `GET /api/cars/highest-mileage` — car with highest mileage

### Trips
- `POST /api/cars/:modelName/trips` — add a trip to a car by model name

---

## Data Model (example JSON)

### Trip
```json
{
  "renterName": "Dana",
  "date": "2026-02-23",
  "kilometers": 120
}
```

### Car
```json
{
  "companyName": "Toyota",
  "modelName": "Corolla",
  "isAvailable": true,
  "totalKilometers": 120,
  "trips": [
    { "renterName": "Dana", "date": "2026-02-23", "kilometers": 120 }
  ]
}
```

---

## Notes / Tips
- Keep the “business logic” in the server models (`Trip`, `Car`, `CompanyFleet`).
- The React client should call the Express API and render:
  - all cars
  - available cars only
  - highest mileage car
  - a form to add cars
  - a form to add trips to a chosen car

---

## License
For school use / homework project.
