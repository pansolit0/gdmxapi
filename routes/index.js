const express = require('express');
const router = express.Router();
const {obtenerDatosChart,exportarExcel,promedioCatorceDias} = require('../controllers/dataController');


// Definición de la ruta para obtener datos
router.post('/datosChart', obtenerDatosChart); //Funcion dentro de la API PHP: apichart
router.post('/exportExcel', exportarExcel); //Funcion dentro de la API PHP: apiExport
router.post('/promedioCatorce', promedioCatorceDias); //Funcion dentro de la API PHP: Apirestful

module.exports = router; 
