const express = require('express');
const app = express();
const { getPool } = require('./db');
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Função para verificar e gerar encomendas
const gerarEncomendas = async () => {
    try {
        const pool = getPool();
        const query = `
            SELECT msh.medicamentoid, msh.servicoid, msh.quantidadedisponivel, msh.quantidademinima,
                   m.nomeMedicamento, tm.descricao, sh.localidadeServico, ts.descricao AS tipoServico
            FROM servicosBD.Medicamento_Servico_Hospitalar msh
            JOIN servicosBD.Medicamento m ON msh.medicamentoid = m.medicamentoid
            JOIN servicosBD.Tipo_Medicamento tm ON m.tipoID = tm.tipoID
            JOIN servicosBD.Servico_Hospitalar sh ON msh.servicoid = sh.servicoid
            JOIN servicosBD.Tipo_Servico ts ON sh.tipoID = ts.tipoID
        `;
        const result = await pool.query(query);
        const medicamentos = result.rows;

        for (const med of medicamentos) {
            if (med.quantidadedisponivel < med.quantidademinima) {
                // Necessário encomendar o medicamento
                console.log(`Necessário encomendar: ${med.nomemedicamento}, Serviço: ${med.localidadeServico || 'Desconhecido'} (${med.tipoServico || 'Desconhecido'})`);

                // Verificar se já existe uma encomenda pendente para este medicamento
                const verificarEncomendaQuery = `
                    SELECT COUNT(*) AS count
                    FROM servicosBD.Encomenda
                    WHERE fornecedorID = 1 AND adminID = 1 AND estadoID = 1 AND encomendaCompleta = false
                    AND dataEncomenda >= NOW() - interval '1 day'
                    AND encomendaID IN (
                        SELECT encomendaID
                        FROM servicosBD.Medicamento_Encomenda
                        WHERE medicamentoID = $1
                    )
                `;
                const verificarEncomendaResult = await pool.query(verificarEncomendaQuery, [med.medicamentoid]);
                if (verificarEncomendaResult.rows[0].count == 0) {
                    const criarEncomendaQuery = `
                        INSERT INTO servicosBD.Encomenda (estadoID, adminID, fornecedorID, aprovadoPorAdministrador, encomendaCompleta, dataEncomenda, dataEntrega, quantidadeEnviada)
                        VALUES (1, 1, 1, false, false, NOW(), NOW() + interval '7 days', $1)
                        RETURNING encomendaID
                    `;
                    const criarEncomendaResult = await pool.query(criarEncomendaQuery, [med.quantidademinima - med.quantidadedisponivel]);
                    const novaEncomendaID = criarEncomendaResult.rows[0].encomendaid;

                    // Vincular medicamento à encomenda
                    const vincularMedicamentoQuery = `
                        INSERT INTO servicosBD.Medicamento_Encomenda (medicamentoID, encomendaID, quantidade)
                        VALUES ($1, $2, $3)
                    `;
                    await pool.query(vincularMedicamentoQuery, [med.medicamentoid, novaEncomendaID, med.quantidademinima - med.quantidadedisponivel]);

                    console.log(`Encomenda criada para ${med.nomemedicamento}, Serviço: ${med.localidadeServico || 'Desconhecido'} (${med.tipoServico || 'Desconhecido'})`);
                } else {
                    console.log(`Encomenda já existente para ${med.nomemedicamento}, Serviço: ${med.localidadeServico || 'Desconhecido'} (${med.tipoServico || 'Desconhecido'})`);
                }
            }
        }
    } catch (error) {
        console.error('Error ao gerar encomendas:', error.message);
    }
};

// Executar gerarEncomendas imediatamente na inicialização
gerarEncomendas();

// Executar gerarEncomendas a cada 5 minutos (300000 milissegundos)
setInterval(gerarEncomendas, 300000);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
