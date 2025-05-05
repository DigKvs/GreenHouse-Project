const pool = require('../startup/db');

class SensorsController {
    static async create(req, res) {
        const { s_umid1, s_umid2, s_temp1, s_temp2, s_luminosity, s_tank } = req.body;
        if (!s_umid1 && !s_umid2 && !s_temp1 && !s_temp2 && !s_luminosity && !s_tank)
            return res.status(400).send({ message: "Dados inválidos" });

        try {
            const [result] = await pool.execute(
                'INSERT INTO Sensors (s_umid1, s_umid2, s_temp1, s_temp2, s_luminosity, s_tank, date ) VALUES (?, ?, ?, ?, ?, ?, now())',
                [s_umid1, s_umid2, s_temp1, s_temp2, s_luminosity, s_tank ]
            );

            return res.status(201).send({
                message: "Sensor inserida com sucesso",
                body: { id: result.insertId, s_umid1, s_umid2, s_temp1, s_temp2, s_luminosity, s_tank }
            });
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    }

    static async getAllPeople(req, res) {
        try {
            const [rows] = await pool.execute('SELECT * FROM Sensors');
            return res.status(200).json(rows);
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    }

    static async getById(req, res) {
        const { id } = req.params;
        if (!id) return res.status(400).send({ message: "No id provided" });

        try {
            const [rows] = await pool.execute('SELECT * FROM Sensors WHERE id = ?', [id]);
            if (rows.length === 0)
                return res.status(404).send({ message: "Sensor não encontrada" });

            return res.status(200).json(rows[0]);
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    }

    static async updateById(req, res) {

        const { id } = req.params;
        const { s_umid1, s_umid2, s_temp1, s_temp2, s_luminosity, s_tank } = req.body;

        if (!s_umid1) return res.status(400).send({ message: "Dados de sensor de humidade 1 não informados" });
        if (!s_umid2) return res.status(400).send({ message: "Dados de sensor de humidade 2 não informados" });
        if (!s_temp1) return res.status(400).send({ message: "Dados de sensor de temperatura 1 não informados" });
        if (!s_temp2) return res.status(400).send({ message: "Dados de sensor de temperatura 2 não informados" });
        if (!s_luminosity) return res.status(400).send({ message: "Dados de sensor de luminosidade não informados" });
        if (!s_tank) return res.status(400).send({ message: "Dados de sensor de tanque de água não informados" });


        try {
            const [result] = await pool.execute(
                'UPDATE OnlinePage SET s_umid1 = ?, s_umid2 = ?, s_temp1 = ?, s_temp2 = ?, s_luminosity = ?, b_door = ? WHERE id = ?',
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
            const [result] = await pool.execute('DELETE FROM sensors WHERE id = ?', [id]);

            if (result.affectedRows === 0)
                return res.status(404).send({ message: "Sensor não encontrado" });

            return res.status(200).send({ message: "Sensor removido com sucesso" });
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    }
    static async getLatest(req, res) {
        try {
            const [rows] = await pool.execute(`
                SELECT * FROM Sensors
                ORDER BY date DESC
                LIMIT 1
            `);
    
            if (rows.length === 0) {
                return res.status(404).json({ message: "Nenhum dado encontrado" });
            }
    
            return res.status(200).json(rows[0]);
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    }    
}

module.exports = SensorsController;
