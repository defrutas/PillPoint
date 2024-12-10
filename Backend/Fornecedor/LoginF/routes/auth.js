const express = require('express');
const router = express.Router();
const { getPool } = require('../db');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const pool = getPool();
        const result = await pool.query('SELECT * FROM fornecedorBD.Credenciais_Fornecedores WHERE email = $1', [email]);
        const user = result.rows[0];
        if (!user || user.password !== password) return res.status(400).send('Invalid credentials');

        const token = jwt.sign({ id: user.credenciaisid }, 'secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;
