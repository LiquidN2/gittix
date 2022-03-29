import request from 'supertest';

import { app } from '../../app';
import { mockAuthenticate, createTicket } from '../../test/utils';

const TEST_ROUTE = '/api/tickets';

describe('PUT /api/tickets', () => {
  it('has a route handler listening', async () => {
    const response = await request(app)
      .put(`${TEST_ROUTE}/someticketid`)
      .send({});
    expect(response.status).not.toEqual(404);
  });

  it('returns status 401 if request is unauthenticated', async () => {
    const response = await request(app)
      .put(`${TEST_ROUTE}/someticketid`)
      .send({});

    expect(response.status).toEqual(401);
  });

  it('returns status 400 if invalid ticket id', async () => {
    const cookie = await mockAuthenticate();
    const response = await request(app)
      .put(`${TEST_ROUTE}/someticketid`)
      .set('Content-Type', 'application/json')
      .set('Cookie', cookie)
      .send({ title: 'test ticket', price: 10 });

    expect(response.statusCode).toEqual(400);
  });

  it('returns status 400 if invalid title or price input', async () => {
    // Create a ticket
    const { cookie, response: createTixRes } = await createTicket();
    const { id: ticketId } = createTixRes.body;

    // Update the ticket created above
    const invalidTitleRes = await request(app)
      .put(`${TEST_ROUTE}/${ticketId}`)
      .set('Cookie', cookie)
      .set('Content-Type', 'application/json')
      .send({ title: '', price: 20 });

    expect(invalidTitleRes.status).toEqual(400);

    const invalidPriceRes = await request(app)
      .put(`${TEST_ROUTE}/${ticketId}`)
      .set('Cookie', cookie)
      .set('Content-Type', 'application/json')
      .send({ title: 'updated ticket title', price: -5 });

    expect(invalidPriceRes.status).toEqual(400);
  });

  it('only allows ticket create to make update', async () => {
    const { response: createTixRes } = await createTicket();
    const newCookie = await mockAuthenticate();

    const { id: ticketId } = createTixRes.body;

    // Update the ticket created above
    const invalidTitleRes = await request(app)
      .put(`${TEST_ROUTE}/${ticketId}`)
      .set('Cookie', newCookie)
      .set('Content-Type', 'application/json')
      .send({ title: 'updated ticket title', price: 20 });

    expect(invalidTitleRes.status).toEqual(401);
  });

  it('returns status 200 if ticket is updated', async () => {
    // Create a ticket
    const { cookie, response: createTixRes } = await createTicket();
    const { id: ticketId } = createTixRes.body;

    // Update the ticket created above
    const response = await request(app)
      .put(`${TEST_ROUTE}/${ticketId}`)
      .set('Cookie', cookie)
      .set('Content-Type', 'application/json')
      .send({ title: 'updated ticket title', price: 20 });

    expect(response.status).toEqual(200);
  });
});
