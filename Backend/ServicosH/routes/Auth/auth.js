const express = require('express');
const router = express.Router();
const { getPool } = require('../db'); // Adjusted path if 'db.js' is in the root
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const pool = getPool(); // Assuming getPool is a function that returns a PostgreSQL pool
        const result = await pool.query('SELECT * FROM servicosBD.Credenciais WHERE email = $1', [email]);
        const user = result.rows[0];

        // Validate credentials
        if (!user || user.password !== password) {
            return res.status(400).send('Invalid credentials');
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user.credenciaisid, isAdmin: user.utilizadorAdministrador },
            process.env.JWT_SECRET || 'your-default-secret', // Use an environment variable for better security
            { expiresIn: '1h' }
        );

        // Return the token in the response
        res.json({ token });
    } catch (error) {
        // Return any error that occurs
        res.status(400).send(error.message);
    }
});

module.exports = router;
