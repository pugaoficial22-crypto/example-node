import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate   = new Rate('errors');
const healthTrend = new Trend('health_duration', true);
const itemsTrend  = new Trend('items_duration', true);

export const options = {
  stages: [
    { duration: '30s', target: 5  },
    { duration: '1m',  target: 20 },
    { duration: '30s', target: 0  },
  ],
  thresholds: {
    'http_req_duration': ['p(95)<2000'],
    'http_req_failed':   ['rate<0.1'],
    'health_duration':   ['p(90)<500'],
    'items_duration':    ['p(90)<1000'],
    'errors':            ['rate<0.1'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {

  group('Vista 1 - Health', function () {
    const res = http.get(`${BASE_URL}/health`);
    healthTrend.add(res.timings.duration);
    const ok = check(res, {
      'health: status 200':     (r) => r.status === 200,
      'health: status es OK':   (r) => {
        try { return JSON.parse(r.body).status === 'OK'; }
        catch { return false; }
      },
      'health: menos de 500ms': (r) => r.timings.duration < 500,
    });
    errorRate.add(!ok);
    sleep(1);
  });

  group('Vista 2 - Items', function () {
    // GET /items — lista completa
    const listRes = http.get(`${BASE_URL}/items`);
    itemsTrend.add(listRes.timings.duration);
    const listOk = check(listRes, {
      'items: status 200':      (r) => r.status === 200,
      'items: es array':        (r) => {
        try { return Array.isArray(JSON.parse(r.body)); }
        catch { return false; }
      },
      'items: tiene elementos': (r) => {
        try { return JSON.parse(r.body).length > 0; }
        catch { return false; }
      },
    });
    errorRate.add(!listOk);
    sleep(1);

    // GET /items/1 — item existente (Laptop)
    const item1Res = http.get(`${BASE_URL}/items/1`);
    const item1Ok = check(item1Res, {
      'items/1: status 200':    (r) => r.status === 200,
      'items/1: tiene nombre':  (r) => {
        try { return JSON.parse(r.body).name !== undefined; }
        catch { return false; }
      },
      'items/1: tiene stock':   (r) => {
        try { return JSON.parse(r.body).stock !== undefined; }
        catch { return false; }
      },
    });
    errorRate.add(!item1Ok);
    sleep(1);

    // GET /items/999 — item inexistente, debe devolver 404
    const notFoundRes = http.get(`${BASE_URL}/items/999`, {
      tags: { expected_response: 'false' },
    });
    const notFoundOk = check(notFoundRes, {
      'items/999: status 404':  (r) => r.status === 404,
    });
    errorRate.add(!notFoundOk);
    sleep(1);
  });
}