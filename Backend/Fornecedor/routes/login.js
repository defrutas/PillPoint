const pool = require('../db'); // Correct path to db.js in the root folder
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM servicosBD.Credenciais WHERE email = $1', [email]);
        const user = result.rows[0];
        if (!user || user.password !== password) return res.status(400).send('Invalid credentials');

        const token = jwt.sign({ id: user.credenciaisid, isAdmin: user.utilizadorAdministrador }, 'secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;
