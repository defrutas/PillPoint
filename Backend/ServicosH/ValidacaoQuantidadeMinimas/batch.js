const express = require('express');
const app = express();
const { getPool } = require('./db');
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Function to check database values
const checkDatabase = async () => {
    try {
        const pool = getPool();
        const query = `
            SELECT msh.medicamentoid, msh.servicoid, msh.quantidadedisponivel, msh.quantidademinima,
                   m.nomeMedicamento, tm.descricao
            FROM servicosBD.Medicamento_Servico_Hospitalar msh
            JOIN servicosBD.Medicamento m ON msh.medicamentoid = m.medicamentoid
            JOIN servicosBD.Tipo_Medicamento tm ON m.tipoID = tm.tipoID
            WHERE msh.quantidadedisponivel < msh.quantidademinima
        `;
        const result = await pool.query(query);
        if (result.rows.length > 0) {
            console.log('Medicamentos abaixo da quantidade mínima:');
            result.rows.forEach(row => {
                console.log(`- Nome: ${row.nomemedicamento}, Descrição: ${row.descricao}, Quantidade Disponível: ${row.quantidadedisponivel}, Quantidade Mínima: ${row.quantidademinima}`);
            });
        } else {
            console.log('Todos os medicamentos estão acima da quantidade mínima.');
        }
    } catch (error) {
        console.error('Error checking database:', error.message);
    }
};

// Run checkDatabase immediately on startup
checkDatabase();

// Run checkDatabase every 5 minutes (300000 milliseconds)
setInterval(checkDatabase, 60000);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
