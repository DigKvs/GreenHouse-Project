const pool = require('../startup/db');

class OnlineController {
    static async create(req, res) {
        const { b_manual, b_luminosity, b_showering, b_ventilation, resistor, b_door } = req.body;
        if (!b_manual && !b_luminosity && !b_showering && !b_ventilation && !resistor && (!b_door && b_door !=0))
            return res.status(400).send({ message: "Dados inválidos" });

        try {
            const [result] = await pool.execute(
                'INSERT INTO OnlinePage ( b_manual, b_luminosity, b_showering, b_ventilation, resistor, b_door ) VALUES (?, ?, ?, ?, ?, ?)',
                [ b_manual, b_luminosity, b_showering, b_ventilation, resistor, b_door ]
            );

            return res.status(201).send({
                message: "Dados inseridos com sucesso",
                body: { id: result.insertId, b_manual, b_luminosity, b_showering, b_ventilation, resistor, b_door }
            });
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    }

    static async getAllPeople(req, res) {
        try {
            const [rows] = await pool.execute('SELECT * FROM OnlinePage');
            return res.status(200).json(rows);
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    }

    static async getById(req, res) {
        const { id } = req.params;
        if (!id) return res.status(400).send({ message: "No id provided" });

        try {
            const [rows] = await pool.execute('SELECT * FROM OnlinePage WHERE id = ?', [id]);
            if (rows.length === 0)
                return res.status(404).send({ message: "Dados não encontrados" });

            return res.status(200).json(rows[0]);
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    }

    static async updateById(req, res) {

        const { id } = req.params;
        const { b_manual, b_luminosity, b_showering, b_ventilation, resistor, b_door } = req.body;

        if (!b_manual && b_manual != 0) return res.status(400).send({ message: "Dados de botão manual não informados" });
        if (!b_luminosity && b_luminosity != 0 ) return res.status(400).send({ message: "Dados de botão de luminosidade não informados" });
        if (!b_showering && b_showering != 0) return res.status(400).send({ message: "Dados de botão de irrigação não informados" });
        if (!b_ventilation && b_ventilation != 0) return res.status(400).send({ message: "Dados de botão de ventilação não informados" });
        if (!resistor && resistor != 0) return res.status(400).send({ message: "Dados de resistencia não informados" });
        if (!b_door && b_door != 0) return res.status(400).send({ message: "Dados de botão de porta não informados" });


        try {
            const [result] = await pool.execute(
                'UPDATE OnlinePage SET b_manual = ?, b_luminosity = ?, b_showering = ?, b_ventilation = ?, resistor = ?, b_door = ? WHERE id = ?',
                [b_manual, b_luminosity, b_showering, b_ventilation, resistor, b_door, id]
            );
            

            if (result.affectedRows === 0)
                return res.status(404).send({ message: "Sensor não encontrado" });

            return res.status(200).send({ message: "Dados atualizados" });
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    }

    static async deleteById(req, res) {
        const { id } = req.params;

        try {
            const [result] = await pool.execute('DELETE FROM OnlinePage WHERE id = ?', [id]);

            if (result.affectedRows === 0)
                return res.status(404).send({ message: "Dados não encontrados" });

            return res.status(200).send({ message: "Dados removidos com sucesso" });
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    }
}

module.exports = OnlineController;
