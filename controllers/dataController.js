const pool = require('../config/db.config');

const obtenerDatosChart = async (req, res) => {
    try {
        // Recibir datos del cuerpo de la solicitud
        const celda = req.body.celda;
        const columna = req.body.columnas;

        if (celda && columna) {
            // Inicializar la consulta SQL base
            let sql = `SELECT ?? FROM ?? WHERE jg != 0 ORDER BY fecha_registro DESC LIMIT 1`;

            // Determinar si la consulta involucra la columna 'jg'
            if (columna === 'jg') {
                // Modificar la consulta para buscar el último dato distinto de 0 para 'jg'
                sql = `SELECT ?? FROM ?? WHERE ?? != 0 ORDER BY fecha_registro DESC LIMIT 1`;
            } else if (columna === 'hf') {
                // Si se pregunta por 'hf', asegurarse de incluir 'hf' en la selección sin importar el valor de 'jg'
                sql = `SELECT ?? FROM ?? ORDER BY fecha_registro DESC LIMIT 1`;
            }

            // Preparar los valores para la consulta SQL
            const values = [columna, celda, columna];

            pool.query(sql, values, (err, result) => {
                if (err) {
                    res.status(500).json({ error: "Error executing query: " + err });
                } else if (result.length > 0) {
                    res.json(result[0]);
                } else {
                    res.status(404).json({ error: "No data found" });
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
