const express = require('express');
const app = express();
const { getPool } = require('./db');
const requisicoesRoutes = require('./routes/requisicao');
const encomendasRoutes = require('./routes/encomendas');
const aprovacoesRoutes = require('./routes/aprovacoes');
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Incluir as rotas de requisição
app.use('/api/requisicao', requisicoesRoutes);

// Incluir as rotas de encomenda
app.use('/api/encomendas', encomendasRoutes);

// Incluir as rotas de aprovação
app.use('/api/aprovacoes', aprovacoesRoutes);
