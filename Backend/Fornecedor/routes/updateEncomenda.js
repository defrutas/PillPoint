const express = require('express');
const axios = require('axios');
const pool = require('../db');

const router = express.Router();

router.post('/', async (req, res) => {
    const {
        encomendaid,
        estadoid,
        fornecedorid,
        dataentrega,
        quantidadeenviada,
        updateUrl // The origin backend URL to send the update back
    } = req.body;

    try {
        // Update Encomenda in the database
        const query = `
            UPDATE Encomenda_Fornecedor
            SET
                estadoID = $1,
                dataEntrega = $2,
                quantidadeEnviada = $3
            WHERE encomendaID = $4
        `;

        const values = [estadoid, dataentrega, quantidadeenviada, encomendaid];
        await pool.query(query, values);

        // Send the updated data back to the origin backend
        const updatedData = {
            encomendaid,
            estadoid,
            fornecedorid,
            dataentrega,
            quantidadeenviada,
        };

        await axios.post(updateUrl, updatedData, {
            headers: { 'Content-Type': 'application/json' },
        });

        res.status(200).json({ message: 'Encomenda updated and sent back successfully' });
    } catch (error) {
        console.error('Error updating encomenda:', error.message);

        if (error.response) {
            return res.status(error.response.status).json({ error: error.response.data });
        }

        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
