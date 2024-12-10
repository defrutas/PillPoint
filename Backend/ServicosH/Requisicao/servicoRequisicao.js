const express = require('express');
const app = express();
const { getPool } = require('./db');
const requisicoesRoutes = require('./routes/requisicao');
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Incluir as rotas de requisição
app.use('/api/requisicao', requisicoesRoutes);
