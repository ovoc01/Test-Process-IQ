import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100, // 100 virtual users
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
  },
};

const BASE_URL = 'http://localhost:5000/api';

export default function () {
  // 1. Login to get token
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    username: 'admin',
    password: 'admin',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  const token = loginRes.json().token;

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };

  // 2. Simulate 500 requests (distributed across VUs)
  const payload = JSON.stringify({
    firstName: `VU${__VU}`,
    lastName: `Iter${__ITER}`,
    email: `vu${__VU}-iter${__ITER}@example.com`,
    phone: '1234567890',
  });

  const res = http.post(`${BASE_URL}/candidates`, payload, params);

  check(res, {
    'is status 201': (r) => r.status === 201,
  });

  sleep(1);
}
