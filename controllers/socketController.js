// obtenerDatosChartGraficoSocket.js
const pool = require('../config/db.config.js');

const obtenerDatosChartGraficoSocket = (socket) => {
    socket.on('solicitarDatosGrafico', (data) => {
        try {
            const { celda, metrica, fecha } = data;

            // Asumiendo que 'fecha' es una cadena en formato 'DD/MM/YYYY'
            // Convertimos a formato 'YYYY-MM-DD' para MySQL
            const [day, month, year] = fecha.split('/');
            const fechaISO = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

            if (celda && metrica && fecha) {
                // Realizar la consulta SQL usando marcadores de posición para prevenir la inyección de SQL
                const sql = `SELECT ${pool.escapeId(celda)}.${pool.escapeId(metrica)}, ${pool.escapeId(celda)}.fecha_registro 
                             FROM ${pool.escapeId(celda)} 
                             WHERE DATE(fecha_registro) = ? 
                             ORDER BY fecha_registro`;
                const values = [fechaISO];

                pool.query(sql, values, (err, results) => {
                    if (err) {
                        console.error('Error ejecutando la consulta:', err.message);
                        socket.emit('errorDatos', { error: "Error executing query: " + err.message });
                        return;
                    }
                    if (results.length === 0) {
                        socket.emit('errorDatos', { error: "No data found" });
                        return;
                    }
                    socket.emit('datosGrafico', results);
                });
            } else {
                socket.emit('errorDatos', { error: "Invalid parameters" });
            }
        } catch (error) {
            console.error('Error:', error.message);
            socket.emit('errorDatos', { error: error.message });
        }
    });
};

module.exports = { obtenerDatosChartGraficoSocket };
