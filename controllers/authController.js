const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const util = require('util');
const pool = require('../config/db.config');


const loginUsuario = async (req, res) => {

    if (!pool.poolquery) {
        pool.poolquery = util.promisify(pool.query); // Asegúrate de que pool.query sea promisificado
    }
    const { username, password } = req.body; // Usa query en lugar de body
    console.log(req.body);
    try {
        const query = 'SELECT username, password FROM usuarios WHERE username = ?';

        const results = await pool.poolquery(query, username); // Usa pool.poolquery para ejecutar la consulta
        console.log({results});
        if (results.length > 0) {
            const user = results[0];

            // Compara las contraseñas directamente
            if (bcrypt.compareSync(password, user.password)) {
                delete user.password;
                const authUser = jwt.sign({
                    data:user
                    // manejar los datos en formulas le da mas indepencias a los datos en si mismos.
                }, 'secret', {expiresIn: 60 * 60 * 24});
                return res.status(200).json({ message: 'Login exitoso', authUser });
            } else {
                // Si la contraseña no coincide, retornar un error de credenciales inválidas
                return res.status(401).json({ error: 'Credenciales invalidas' });
            }
        } else {
            // Si no se encuentra el usuario, retornar un error de usuario no encontrado
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error(error);
        // Manejar errores generales del servidor
        return res.status(500).json({ error: 'Server error' });
    }
};


module.exports = {
    loginUsuario
};
