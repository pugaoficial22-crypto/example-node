import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5, // Bajamos un poco los VUs para asegurar que el runner de GH no sufra
  duration: '20s',
  thresholds: {
    'http_req_duration': ['p(95)<2000'],
    'http_req_failed': ['rate<0.1'],
  },
};

export default function () {
  const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
  const res = http.get(`${BASE_URL}/health`);
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'body has OK': (r) => r.body.includes('OK'),
  });

  sleep(1);
}