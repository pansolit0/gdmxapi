
// Importa las dependencias necesarias para las pruebas
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const util = require('util');
const db = require('../config/db.config');

// Aquí se requiere el módulo que contiene la función a probar
const { loginUsuario } = require('../controllers/authController');

// Mockea los módulos externos antes de las pruebas
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../config/db.config', () => ({
  query: jest.fn().mockReturnThis(),
  poolquery: jest.fn(),
}));

describe('Pruebas de integración para el login de usuario', () => {
  // Restablece los mocks antes de cada prueba para evitar interferencias entre pruebas
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe autenticar a un usuario con credenciales válidas', async () => {
    const mockRequest = {
      body: {
        username: 'demoMel',
        password: 'demoMel', // Contraseña en texto plano
      },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    // Configura los mocks para simular el comportamiento esperado en esta prueba
    bcrypt.compareSync.mockReturnValue(true);
    jwt.sign.mockReturnValue('token_de_prueba');
    db.poolquery.mockResolvedValue([{ username: 'demoMel', password: '$2b$10$BgVytrta1O2Q4WXWC2kIHuPxdD9bDhL6OaLKuYn5RiNuQEq7VmVFG' }]);

    await loginUsuario(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Login exitoso',
      authUser: 'token_de_prueba',
    });
  });

  it('debe rechazar un usuario con contraseña incorrecta', async () => {
    const mockRequest = {
      body: {
        username: 'demoMel',
        password: 'contraseñaIncorrecta',
      },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    bcrypt.compareSync.mockReturnValue(false);
    db.poolquery.mockResolvedValue([{ username: 'demoMel', password: '$2b$10$BgVytrta1O2Q4WXWC2kIHuPxdD9bDhL6OaLKuYn5RiNuQEq7VmVFG' }]);

    await loginUsuario(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Credenciales invalidas',
    });
  });

  it('debe retornar un error si el usuario no existe', async () => {
    const mockRequest = {
      body: {
        username: 'usuarioInexistente',
        password: 'demoMel',
      },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    db.poolquery.mockResolvedValue([]);

    await loginUsuario(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Usuario no encontrado',
    });
  });

  // Continúa agregando más pruebas según sea necesario
});
