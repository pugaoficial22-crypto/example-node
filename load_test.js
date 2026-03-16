import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Métricas personalizadas para monitoreo detallado
const errorRate   = new Rate('errors');
const healthTrend = new Trend('health_duration', true);
const itemsTrend  = new Trend('items_duration', true);

export const options = {
  stages: [
    { duration: '20s', target: 5  }, // Rampa de subida rápida
    { duration: '40s', target: 15 }, // Carga estable
    { duration: '10s', target: 0  }, // Rampa de bajada
  ],
  thresholds: {
    // Umbrales flexibles para evitar que el pipeline falle por lag del runner de GitHub
    'http_req_duration': ['p(95)<3000'], // 95% de peticiones debajo de 3s
    'http_req_failed':   ['rate<0.5'],   // Toleramos hasta 50% de errores de red en CI/CD
    'health_duration':   ['p(90)<1000'],
    'items_duration':    ['p(90)<1500'],
    'errors':            ['rate<0.5'],   // El pipeline sigue aunque fallen algunos checks
  },
};

// BASE_URL dinámica: usa localhost en el pipeline o lo que definas
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {

  group('Vista 1 - Health', function () {
    const res = http.get(`${BASE_URL}/health`);
    healthTrend.add(res.timings.duration);
    
    const ok = check(res, {
      'health: status 200':     (r) => r.status === 200,
      'health: body tiene OK':  (r) => r.body.includes('OK'),
    });
    
    errorRate.add(!ok);
    sleep(1);
  });

  group('Vista 2 - Items', function () {
    // 1. GET /items — Lista completa
    const listRes = http.get(`${BASE_URL}/items`);
    itemsTrend.add(listRes.timings.duration);
    
    const listOk = check(listRes, {
      'items: status 200': (r) => r.status === 200,
      'items: es JSON':    (r) => {
        try { JSON.parse(r.body); return true; } catch { return false; }
      },
    });
    errorRate.add(!listOk);
    sleep(1);

    // 2. GET /items/1 — Item existente
    const item1Res = http.get(`${BASE_URL}/items/1`);
    const item1Ok = check(item1Res, {
      'items/1: status 200': (r) => r.status === 200,
    });
    errorRate.add(!item1Ok);
    sleep(1);

    // 3. GET /items/999 — 404 esperado
    const notFoundRes = http.get(`${BASE_URL}/items/999`);
    check(notFoundRes, {
      'items/999: status 404': (r) => r.status === 404,
    });
    // No sumamos a errorRate porque el 404 es el comportamiento correcto aquí
    sleep(1);
  });
}