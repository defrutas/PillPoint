require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const bodyParser = require('body-parser');

// Import routes
const receiveEncomendaRoute = require('./routes/receiveEncomenda'); // Renamed to avoid conflict
const updateEncomenda = require('./routes/updateEncomenda');
const loginRoute = require('./routes/auth'); // Import login route

const app = express();
const PORT = process.env.PORT || 3000; // Use the PORT from .env or fallback to 3000

// Middleware to parse JSON
app.use(bodyParser.json());

// Routes
app.use('/api/receive-encomenda', receiveEncomendaRoute); // Used renamed variable
app.use('/api/update-encomenda', updateEncomenda);
app.use('/api/auth', loginRoute); // Add the login route

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
