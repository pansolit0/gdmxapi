const express = require('express');
const cors = require('cors');

const app = express();



// Configuración de CORS para permitir cualquier origen
app.use(cors({
    origin: '*', // Permitir cualquier origen
    methods: ['GET', 'POST', 'OPTIONS'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeceras permitidas
    credentials: true, // Permitir cookies de origen cruzado
    maxAge: 86400 // Tiempo máximo para caché de preflight (en segundos)
}));

app.use(express.json());

// Definir otras rutas y middleware aquí
app.use(require('./routes/index')); 

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});
