const pool = require('../config/db.config');

const obtenerDatosChart = async (req, res) => {
  try {
    // Recibir datos del cuerpo de la solicitud
    const celda = req.body.celda;
    const columna = req.body.columnas;

    if (celda && columna) {
      // Consulta SQL adaptada para manejar dinámicamente las columnas y celdas
      const sql = 
        SELECT
          *,
          LAG(${columna}, 1) OVER (PARTITION BY ${celda} ORDER BY fecha_registro DESC) AS ultimo_valor_no_cero
        FROM
          tu_tabla
        WHERE
          ${celda} = ? AND (${columna} != 0 OR ${columna} IS NOT NULL)
        ORDER BY
          fecha_registro DESC
        LIMIT 1;
      ;
      const values = [celda]; // Asegúrate de que esto se corresponda con los parámetros de tu consulta

      const result = await pool.query(sql, values);
      if (result.length > 0) {
        res.json(result[0]);
      } else {
        res.status(404).json({ error: "No data found" });
      }
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
