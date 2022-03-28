import request from 'supertest';

import { app } from '../../app';

describe('POST /api/tickets', () => {
  it('has a route handler listening', async () => {
    const response = await request(app)
      .post('/api/tickets')
      .set('Content-Type', 'application/json')
      .send({});

    expect(response.status).not.toEqual(404);
  });

  it('only allows authenticated request', async () => {
    const response = await request(app)
      .post('/api/tickets')
      .set('Content-Type', 'application/json')
      .send({ title: 'ticket name', price: '200 USD' });

    expect(response.status).toEqual(401);
  });

  // it('returns status 201 on creating a new ticket', async () => {
  //   const response = await request(app)
  //     .post('/api/tickets')
  //     .set('Content-Type', 'application/json')
  //     .send({ title: 'Ed Sheran concert ticket', price: '200 USD' });
  //
  //   expect(response.status).toEqual(201);
  // });
});
