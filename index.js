const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Acepta conexiones de cualquier origen. Ajusta esto para mayor seguridad en producción.
    methods: ["GET", "POST"]
  }
});
const PORT = process.env.PORT || 10000;

// Importa el controlador de sockets
const { obtenerDatosChartGraficoSocket } = require('./controllers/socketController');
const pool = require('./config/db.config');

// Configuración de CORS para permitir cualquier origen
app.use(cors({
    origin: '*', // Permitir cualquier origen
    methods: ['GET', 'POST', 'OPTIONS'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeceras permitidas
    credentials: true, // Permitir cookies de origen cruzado
    maxAge: 86400 // Tiempo máximo para caché de preflight (en segundos)
}));

io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado');
  
    // Utiliza el controlador aquí, pasando tanto el socket como el pool
    obtenerDatosChartGraficoSocket(socket, pool);
  
    socket.on('disconnect', () => {
      console.log('Un usuario se ha desconectado');
    });
  });
  
  app.get('/', (req, res) => {
      res.send('<h1>Hola mundo con Socket.io!</h1>');
  });

app.use(express.json());

// Definir otras rutas y middleware aquí
app.use(require('./routes/index')); 

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

module.exports = app ;
