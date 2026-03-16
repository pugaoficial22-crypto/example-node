import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate   = new Rate('errors');
const healthTrend = new Trend('health_duration', true);
const itemsTrend  = new Trend('items_duration', true);

export const options = {
  stages: [
    { duration: '20s', target: 5  },
    { duration: '40s', target: 15 },
    { duration: '10s', target: 0  },
  ],
  thresholds: {
    'http_req_duration': ['p(95)<3000'],
    'http_req_failed':   ['rate<0.5'],
    'health_duration':   ['p(90)<1000'],
    'items_duration':    ['p(90)<1500'],
    'errors':            ['rate<0.5'],
  },
};

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
    const listRes = http.get(`${BASE_URL}/items`);
    itemsTrend.add(listRes.timings.duration);
    
    const listOk = check(listRes, {
      'items: status 200': (r) => r.status === 200,
      'items: es JSON':    (r) => {
        try { 
          JSON.parse(r.body); 
          return true; 
        } catch (e) { // <--- AQUÍ agregamos el (e)
          return false; 
        }
      },
    });
    errorRate.add(!listOk);
    sleep(1);

    const item1Res = http.get(`${BASE_URL}/items/1`);
    const item1Ok = check(item1Res, {
      'items/1: status 200': (r) => r.status === 200,
    });
    errorRate.add(!item1Ok);
    sleep(1);

    const notFoundRes = http.get(`${BASE_URL}/items/999`);
    check(notFoundRes, {
      'items/999: status 404': (r) => r.status === 404,
    });
    sleep(1);
  });
}