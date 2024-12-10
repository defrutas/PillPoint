const express = require('express');
const app = express();
const { getPool } = require('./db');
const encomendasRoutes = require('./routes/encomendas');
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Incluir as rotas de encomenda
app.use('/api/encomendas', encomendasRoutes);
