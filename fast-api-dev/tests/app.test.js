const request = require('supertest');
const app = require('../src/app');
const { calculateValue } = require('../src/logic');
const { hasStock, applyDiscount } = require('../src/logic');

describe('Suite de Pruebas de Calidad de Software', () => {

  describe('Pruebas Unitarias - Lógica de Inventario', () => {
    test('Debe calcular correctamente el valor total (10 * 5 = 50)', () => {
      const result = calculateValue(10, 5);
      expect(result).toBe(50);
    });

    test('Debe retornar 0 si se ingresan valores negativos', () => {
      const result = calculateValue(-10, 5);
      expect(result).toBe(0);
    });

    test('Debe retornar true si hay stock disponible', () => {
      expect(hasStock(10)).toBe(true);
      expect(hasStock(0)).toBe(false);
    });

    test('Debe aplicar correctamente un descuento del 20% a un precio de 100', () => {
      const result = applyDiscount(100, 20);
      expect(result).toBe(80);
    });
  });


  describe('Pruebas de Integración - API Endpoints', () => {
    test('GET /health - Debe responder con status 200 y JSON correcto', async () => {
      const response = await request(app).get('/health');
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('status', 'OKK');
    });

    test('GET /items - Debe validar la estructura del inventario', async () => {
      const response = await request(app).get('/items');
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      // Validamos que el primer objeto tenga las propiedades requeridas
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('stock');
    });

    test('GET /items/:id - Debe retornar un item específico por id', async () => {
      const response = await request(app).get('/items/1');

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('name', 'Laptop');
    });

    test('GET /items/:id - Debe retornar 404 si el item no existe', async () => {
      const response = await request(app).get('/items/999');

      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty('error', 'Item no encontrado');
    });
  });
});

