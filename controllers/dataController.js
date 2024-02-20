const pool = require('../config/db.config');

const obtenerDatosChart = async (req, res) => {
    try {
        // Recibir datos del body de la solicitud
        const celda = req.body.celda;
        const columna = req.body.columnas;

        if (celda && columna) {
            // Modificación para filtrar valores nulos, cadenas vacías y valores 0 antes de seleccionar el último disponible.
            const sql = `SELECT * FROM (SELECT ?? FROM ?? WHERE ?? IS NOT NULL AND ?? != '' AND ?? != 0 ORDER BY fecha_registro DESC) AS filtered_table LIMIT 1`;
            const values = [columna, celda, columna, columna, columna]; // Ajustado para incluir el filtrado de 0

            pool.query(sql, values, (err, result) => {
                if (err) {
                    res.status(500).json({ error: "Error executing query: " + err });
                } else if (result.length > 0) {
                    res.json(result[0]);
                } else {
                    res.status(404).json({ error: "No data found after filtering invalid entries" });
                }
            });
        } else {
            res.status(400).json({ error: "Invalid parameters" });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const exportarExcel = async (req, res) => {
    try {
        const nombreTabla = req.body.celda;
        const columns = ['jg', 'hf', 'ro', 'sb', 'eg', 'p1', 'p2', 'fecha_registro']; 

        const sql = `SELECT ${columns.join(", ")} FROM ${nombreTabla}`;
        pool.query(sql, (err, result) => {
            if (err) {
                throw err; // Lanza un error que será capturado por el bloque catch
            }
            if (result.length > 0) {
                res.json(result);
            } else {
                res.status(404).json({ error: "No data found" });
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const promedioCatorceDias = async (req, res) => {
    try {
        const nombreTabla = req.body.celda;
        const sql = `
                SELECT DATE(fecha_registro) as fecha, AVG(jg) as promediojg, AVG(hf) as promediohf
                FROM ${nombreTabla}
                WHERE fecha_registro >= CURDATE() - INTERVAL 14 DAY
                GROUP BY DATE(fecha_registro)
                ORDER BY fecha ASC`;

        pool.query(sql, (err, result) => {
            if (err) {
                throw err;
            }
            res.json(result);
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    obtenerDatosChart,
    exportarExcel,
    promedioCatorceDias
}
