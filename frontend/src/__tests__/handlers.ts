import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('*/api/auth/login', () => {
    return HttpResponse.json({ token: 'mock-token' });
  }),

  http.get('*/api/candidates', () => {
    return HttpResponse.json({
      candidates: [
        {
          _id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '1234567890',
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      totalPages: 1,
      currentPage: 1,
      total: 1,
    });
  }),

  http.get('*/api/candidates/:id', ({ params }) => {
    return HttpResponse.json({
      _id: params.id,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1234567890',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }),
];
