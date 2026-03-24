const request = require('supertest');
const app = require('../src/app'); 
const { calculateValue, hasStock, applyDiscount } = require('../src/logic');

describe('Suite de Pruebas de Calidad de Software', () => {

  // =========================
  // 🧠 PRUEBAS UNITARIAS
  // =========================
  describe('Pruebas Unitarias - Lógica de Inventario', () => {
    test('Debe calcular correctamente el valor total (10 * 5 = 50)', () => {
      expect(calculateValue(10, 5)).toBe(50);
    });

    test('Debe retornar 0 si se ingresan valores negativos', () => {
      expect(calculateValue(-10, 5)).toBe(0);
    });

    test('Debe validar correctamente el stock', () => {
      expect(hasStock(10)).toBe(true);
      expect(hasStock(0)).toBe(false);
    });

    test('Debe aplicar correctamente un descuento del 20%', () => {
      expect(applyDiscount(100, 20)).toBe(80);
    });
  });

  // =========================
  // 🌐 PRUEBAS DE API
  // =========================
  describe('Pruebas de Integración - API Endpoints', () => {
    test('GET /health - responde OK', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'OK');
    });

    test('GET /items - retorna lista', async () => {
      const res = await request(app).get('/items');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test('GET /items/:id - item existente', async () => {
      const res = await request(app).get('/items/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', 1);
    });

    test('GET /items/:id - item NO existe', async () => {
      const res = await request(app).get('/items/999');
      expect(res.statusCode).toBe(404);
    });
  });

  // =========================
  // 🔥 COBERTURA EXTRA (MÉTRICAS Y ERRORES)
  // =========================
  describe('Cobertura Extra', () => {
    test('La app debe estar definida', () => {
      expect(app).toBeDefined();
    });

    test('Ruta inexistente debe responder error 404', async () => {
      const res = await request(app).get('/ruta-que-no-existe-nunca');
      expect(res.statusCode).toBe(404);
    });

    // TEST CLAVE PARA EL ENDPOINT DE MÉTRICAS (Líneas 56-61 de app.js)
    test('GET /metrics - debe retornar métricas de Prometheus', async () => {
      const res = await request(app).get('/metrics');
      expect(res.statusCode).toBe(200);
      expect(res.text).toContain('http_requests_total');
    });

    test('calculateValue con 0', () => {
      expect(calculateValue(0, 10)).toBe(0);
    });

    test('applyDiscount sin descuento', () => {
      expect(applyDiscount(100, 0)).toBe(100);
    });

    test('applyDiscount 100%', () => {
      expect(applyDiscount(100, 100)).toBe(0);
    });
  });

  // =========================
  // ✅ VALIDACIÓN DE ENTORNO
  // =========================
  describe('Simulación de entorno', () => {
    test('Debe estar en entorno de pruebas', () => {
      expect(process.env.NODE_ENV).toBe('test');
    });
    
    test('app.js carga correctamente en modo test', () => {
      const appRef = require('../src/app');
      expect(appRef).toBeDefined();
    });
  });

});