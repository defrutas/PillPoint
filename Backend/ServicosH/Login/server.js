const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const authRoutes = require('./routes/auth');

// Authentication routes
app.use('/api/auth', authRoutes);
