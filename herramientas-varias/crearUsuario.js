const bcrypt = require('bcrypt');
const pool = require('../config/db.config');

const util = require('util');
if (pool.query.constructor.name !== "AsyncFunction") {
    pool.query = util.promisify(pool.query);
}

async function crearUsuarioHashed() {
    try {
        const username = "demo2";
        const passwordPlana = "demo2";
        const saltRounds = 10;

        // Generar el hash de la contraseña
        const passwordHashed = await bcrypt.hash(passwordPlana, saltRounds);

        console.log(`Username: ${username}`);
        console.log(`Password (hashed): ${passwordHashed}`);

        const result = await pool.query('INSERT INTO usuarios (username, password) VALUES (?, ?)', [username, passwordHashed]);
        console.log('Usuario creado con éxito. ID:', result.insertId);
    } catch (error) {
        console.error('Error al crear el usuario:', error);
    }
}

crearUsuarioHashed();
