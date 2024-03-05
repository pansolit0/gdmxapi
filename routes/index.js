const express = require('express');
const router = express.Router();
const {obtenerDatosChart,exportarExcel,promedioCatorceDias, obtenerDatosChartGrafico, obtenerDatosTabla} = require('../controllers/dataController');
const { loginUsuario } = require('../controllers/authController')


// Definición de la ruta para obtener datos
router.post('/datosChart', obtenerDatosChart); //Funcion dentro de la API PHP: apichart
router.post('/exportExcel', exportarExcel); //Funcion dentro de la API PHP: apiExport
router.post('/promedioCatorce', promedioCatorceDias); //Funcion dentro de la API PHP: Apirestful
router.post('/grafico', obtenerDatosChartGrafico);
router.post('/tabla', obtenerDatosTabla);


router.post('/users/login',loginUsuario);

module.exports = router; 
