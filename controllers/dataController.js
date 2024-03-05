const pool = require('../config/db.config');

const obtenerDatosChart = async (req, res) => {
    try {
        // Recibir datos del cuerpo de la solicitud
        const celda = req.body.celda;
        const columna = req.body.columnas;



        if (celda && columna) {
            const sql = `SELECT ?? FROM ?? ORDER BY fecha_registro DESC LIMIT 1`;
            const values = [columna, celda];

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

const obtenerDatosChartGrafico = async (req, res) => {
    try {
        const { celda, metrica, rangoHoras } = req.body; // Asegúrate de incluir 'metrica' en el cuerpo de la solicitud

        // Calcula el momento de inicio basado en rangoHoras
        const fechaInicio = new Date();
        fechaInicio.setHours(fechaInicio.getHours() - rangoHoras);

        if (celda && metrica && rangoHoras) {
            // Asegúrate de que la consulta SQL seleccione la métrica correcta y registros dentro del rango de tiempo
            const sql = 'SELECT ??, fecha_registro FROM ?? WHERE fecha_registro > ? ORDER BY fecha_registro';
            const values = [metrica, celda, fechaInicio];

            pool.query(sql, values, (err, results) => {
                if (err) {
                    return res.status(500).json({ error: "Error executing query: " + err.message });
                }
                if (results.length === 0) {
                    return res.status(404).json({ error: "No data found" });
                }
                res.json(results);
            });
        } else {
            res.status(400).json({ error: "Invalid parameters" });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};


const obtenerDatosTabla = async (req, res) => {
    try {
        const { celda, columnas, rangoHoras } = req.body;

        // Calcula el momento de inicio basado en rangoHoras
        const fechaInicio = new Date();
        fechaInicio.setHours(fechaInicio.getHours() - rangoHoras);

        if (celda && columnas && Array.isArray(columnas) && columnas.length > 0) {
            // Construye la lista de columnas para la consulta SQL
            const columnasSQL = columnas.join(", ");

            // Asegúrate de que la consulta SQL seleccione registros dentro del rango de tiempo
            // y solo las columnas especificadas. Ajusta según tu gestor de base de datos si es necesario.
            const sql = `SELECT ${columnasSQL} FROM ?? WHERE fecha_registro > ? ORDER BY fecha_registro`;
            const values = [celda, fechaInicio];

            pool.query(sql, values, (err, results) => {
                if (err) {
                    return res.status(500).json({ error: "Error executing query: " + err.message });
                }
                if (results.length === 0) {
                    return res.status(404).json({ error: "No data found" });
                }
                res.json(results);
            });
        } else {
            res.status(400).json({ error: "Invalid parameters" });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};


module.exports = {
    obtenerDatosChart,
    exportarExcel,
    promedioCatorceDias,
    obtenerDatosChartGrafico,
    obtenerDatosTabla
}
