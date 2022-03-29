import request from 'supertest';

import { app } from '../../app';
import { mockAuthenticate } from '../../test/utils';

describe('POST /api/tickets', () => {
  it('has a route handler listening', async () => {
    const response = await request(app).post('/api/tickets').send({});

    expect(response.status).not.toEqual(404);
  });

  it('only allows authenticated request', async () => {
    const unauthorizedRes = await request(app)
      .post('/api/tickets')
      .set('Content-Type', 'application/json')
      .send({ title: 'ticket name', price: '200 USD' });

    expect(unauthorizedRes.status).toEqual(401);

    const cookie = await mockAuthenticate();
    const authorizedRes = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .set('Content-Type', 'application/json')
      .send({ title: 'ticket name', price: '200 USD' });

    expect(authorizedRes.status).toEqual(201);
  });

  it('returns status 400 if ticket title or price is invalid', async () => {
    const cookie = await mockAuthenticate();

    const invalidTicketRes = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .set('Content-Type', 'application/json')
      .send({ title: '', price: '200 USD' });

    expect(invalidTicketRes.status).toEqual(400);

    const invalidPriceRes = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .set('Content-Type', 'application/json')
      .send({ title: 'test ticket title', price: '' });

    expect(invalidPriceRes.status).toEqual(400);
  });
});
