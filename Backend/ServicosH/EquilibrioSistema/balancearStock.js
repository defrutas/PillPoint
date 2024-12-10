const express = require('express');
const app = express();
const { getPool } = require('./db');
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Função para verificar e balancear o stock
const balancearStock = async () => {
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
                // Necessário reabastecer o medicamento
                console.log(`Necessário reabastecer: ${med.nomemedicamento}, Serviço: ${med.localidadeServico || 'Desconhecido'} (${med.tipoServico || 'Desconhecido'})`);

                // Encontrar unidades com excesso de stock
                const unidadesComExcessoQuery = `
                    SELECT servicoid, quantidadedisponivel
                    FROM servicosBD.Medicamento_Servico_Hospitalar
                    WHERE medicamentoid = $1 AND quantidadedisponivel > quantidademinima
                    ORDER BY quantidadedisponivel DESC
                `;
                const unidadesComExcesso = await pool.query(unidadesComExcessoQuery, [med.medicamentoid]);
                
                for (const unidade of unidadesComExcesso.rows) {
                    let excesso = unidade.quantidadedisponivel - med.quantidademinima;
                    if (excesso > 0) {
                        // Transferir stock
                        const transferirQuery = `
                            UPDATE servicosBD.Medicamento_Servico_Hospitalar
                            SET quantidadedisponivel = quantidadedisponivel - $1
                            WHERE medicamentoid = $2 AND servicoid = $3;
                            UPDATE servicosBD.Medicamento_Servico_Hospitalar
                            SET quantidadedisponivel = quantidadedisponivel + $1
                            WHERE medicamentoid = $2 AND servicoid = $4
                        `;
                        await pool.query(transferirQuery, [excesso, med.medicamentoid, unidade.servicoid, med.servicoid]);

                        // Verificar se ainda é necessário mais stock
                        const atualQuantidadeQuery = `
                            SELECT quantidadedisponivel
                            FROM servicosBD.Medicamento_Servico_Hospitalar
                            WHERE medicamentoid = $1 AND servicoid = $2
                        `;
                        const atualQuantidadeResult = await pool.query(atualQuantidadeQuery, [med.medicamentoid, med.servicoid]);
                        if (atualQuantidadeResult.rows[0].quantidadedisponivel >= med.quantidademinima) {
                            break; // Quantidade mínima alcançada
                        }
                    }
                }

                // Enviar requisição se não foi possível reabastecer completamente e não existir requisição similar
                const atualQuantidadeFinalQuery = `
                    SELECT quantidadedisponivel
                    FROM servicosBD.Medicamento_Servico_Hospitalar
                    WHERE medicamentoid = $1 AND servicoid = $2
                `;
                const atualQuantidadeFinalResult = await pool.query(atualQuantidadeFinalQuery, [med.medicamentoid, med.servicoid]);
                if (atualQuantidadeFinalResult.rows[0].quantidadedisponivel < med.quantidademinima) {
                    const verificarRequisicaoQuery = `
                        SELECT COUNT(*) AS count
                        FROM servicosBD.Requisicao
                        WHERE profissionalID = 1 AND adminID = 1 AND estadoID = 1 AND requisicaoCompleta = false
                        AND dataRequisicao >= NOW() - interval '1 day'
                    `;
                    const verificarRequisicaoResult = await pool.query(verificarRequisicaoQuery);
                    if (verificarRequisicaoResult.rows[0].count == 0) {
                        const criarRequisicaoQuery = `
                            INSERT INTO servicosBD.Requisicao (estadoID, profissionalID, adminID, aprovadoPorAdministrador, requisicaoCompleta, dataRequisicao, dataEntrega)
                            VALUES (1, 1, 1, false, false, NOW(), NOW() + interval '7 days')
                        `;
                        await pool.query(criarRequisicaoQuery);
                        console.log(`Requisição criada para ${med.nomemedicamento}, Serviço: ${med.localidadeServico || 'Desconhecido'} (${med.tipoServico || 'Desconhecido'})`);
                    } else {
                        console.log(`Requisição já existente para ${med.nomemedicamento}, Serviço: ${med.localidadeServico || 'Desconhecido'} (${med.tipoServico || 'Desconhecido'})`);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error ao balancear o stock:', error.message);
    }
};

// Executar balancearStock imediatamente na inicialização
balancearStock();

// Executar balancearStock a cada 5 minutos (300000 milissegundos)
setInterval(balancearStock, 300000);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
