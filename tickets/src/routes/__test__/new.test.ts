import request from 'supertest';
import { mockAuthenticate } from '@hngittix/common';

import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

const TEST_ROUTE = '/api/tickets';

describe(`POST ${TEST_ROUTE}`, () => {
  it('has a route handler listening', async () => {
    const response = await request(app).post(TEST_ROUTE).send({});

    expect(response.status).not.toEqual(404);
  });

  it('returns status 401 if request is unauthorized', async () => {
    const unauthorizedRes = await request(app)
      .post(TEST_ROUTE)
      .set('Content-Type', 'application/json')
      .send({ title: 'ticket name', price: 20 });

    expect(unauthorizedRes.status).toEqual(401);
  });

  it('returns status 400 if ticket title or price is invalid', async () => {
    const cookie = await mockAuthenticate();

    const invalidTicketRes = await request(app)
      .post(TEST_ROUTE)
      .set('Cookie', cookie)
      .set('Content-Type', 'application/json')
      .send({ title: '', price: 20 });

    expect(invalidTicketRes.status).toEqual(400);

    const invalidPriceRes = await request(app)
      .post(TEST_ROUTE)
      .set('Cookie', cookie)
      .set('Content-Type', 'application/json')
      .send({ title: 'test ticket title', price: -5 });

    expect(invalidPriceRes.status).toEqual(400);
  });

  it('returns status 400 if userId is not of mongo object id format', async () => {
    const cookie = await mockAuthenticate({
      id: 'somerandomtestid123',
      email: 'test@test.com',
    });

    const response = await request(app)
      .post(TEST_ROUTE)
      .set('Cookie', cookie)
      .set('Content-Type', 'application/json')
      .send({ title: 'test ticket', price: 10 });

    expect(response.status).toEqual(400);
  });

  it('returns status 201 and creates a ticket with valid inputs', async () => {
    const cookie = await mockAuthenticate();

    // Returns a 201 status
    const response = await request(app)
      .post(TEST_ROUTE)
      .set('Cookie', cookie)
      .set('Content-Type', 'application/json')
      .send({ title: 'Test ticket', price: 20 });

    expect(response.status).toEqual(201);

    // Creates a ticket document in db
    const { id: ticketId } = response.body;
    const ticket = await Ticket.findById(ticketId);
    expect(ticket).toBeDefined();
  });

  it('publishes an event upon successful request', async () => {
    // Create a new ticket
    const cookie = await mockAuthenticate();

    const response = await request(app)
      .post(TEST_ROUTE)
      .set('Cookie', cookie)
      .set('Content-Type', 'application/json')
      .send({ title: 'Test ticket', price: 20 });

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
