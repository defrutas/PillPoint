const express = require('express');
const pool = require('../db');

const router = express.Router();

router.post('/', async (req, res) => {
    const {
        encomendaid,
        estadoid,
        fornecedorid,
        encomendacompleta,
        dataencomenda,
        dataentrega,
        quantidadeenviada
    } = req.body;

    try {
        // Save Encomenda to the database
        const query = `
            INSERT INTO Encomenda_Fornecedor (
                encomendaID,
                encomendaCompleta,
                dataEncomenda,
                dataEntrega,
                quantidadeEnviada,
                estadoID,
                medicamentoID
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (encomendaID) DO NOTHING
        `;

        const values = [
            encomendaid,
            encomendacompleta,
            dataencomenda,
            dataentrega,
            quantidadeenviada,
            estadoid,
            fornecedorid
        ];

        await pool.query(query, values);

        res.status(201).json({ message: 'Encomenda received and saved successfully' });
    } catch (error) {
        console.error('Error saving encomenda:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
