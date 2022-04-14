import request from 'supertest';
import { mockAuthenticate } from '@hngittix/common';

import { app } from '../../app';
import { createTicket } from '../../test/utils';
import { natsWrapper } from '../../nats-wrapper';

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

  it('publish an event when ticket us successfully updated', async () => {
    // Create a ticket
    const { cookie, response: createTixRes } = await createTicket();
    const { id: ticketId } = createTixRes.body;

    // Update the ticket created above
    const response = await request(app)
      .put(`${TEST_ROUTE}/${ticketId}`)
      .set('Cookie', cookie)
      .set('Content-Type', 'application/json')
      .send({ title: 'updated ticket title', price: 20 });

    const ticket = response.body;

    // asserts event publisher is called
    expect(natsWrapper.client.publish).toHaveBeenCalled();

    // access the data passed to the publish function
    const eventData = JSON.parse(
      (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    );

    // asserts the eventData contains subset of ticket
    expect(ticket).toMatchObject(eventData);
  });
});
