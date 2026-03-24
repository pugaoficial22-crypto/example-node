import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    'http_req_duration': ['p(95)<3000'], // 95% de peticiones debajo de 3s
    'http_req_failed': ['rate<0.5'],      // Menos del 50% de errores
  },
};

export default function () {
  const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
  
  // Validamos el endpoint de salud
  const res = http.get(`${BASE_URL}/health`);
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'has ok text': (r) => r.body && r.body.includes('OK'),
  });

  sleep(1);
}