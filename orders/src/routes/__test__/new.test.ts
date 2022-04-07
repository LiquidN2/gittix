import request from 'supertest';
import { Types } from 'mongoose';
import { mockAuthenticate } from '@hngittix/common';

import { app } from '../../app';
import { Ticket } from '../../models/ticket';

const TEST_ROUTE = '/api/orders';
const { ObjectId } = Types;

describe(`POST ${TEST_ROUTE}`, () => {
  it('has a route handler', async () => {
    const response = await request(app).post(TEST_ROUTE).send({});
    expect(response.status).not.toEqual(404);
  });

  it('only allows authenticated request', async () => {
    const response = await request(app).post(TEST_ROUTE).send({});
    expect(response.status).toEqual(401);
  });

  it('returns 400 if ticket id is invalid', async () => {
    const cookie = await mockAuthenticate();
    const response = await request(app)
      .post(TEST_ROUTE)
      .set('Cookie', cookie)
      .set('Content-Type', 'application/json')
      .send({ ticketId: 'ascawsdc' });

    expect(response.status).toEqual(400);
  });

  it('returns 404 if ticket not found', async () => {
    const cookie = await mockAuthenticate();
    const response = await request(app)
      .post(TEST_ROUTE)
      .set('Cookie', cookie)
      .set('Content-Type', 'application/json')
      .send({ ticketId: new ObjectId().toString() });

    expect(response.status).toEqual(404);
  });

  it('returns 400 if ticket is reserved', async () => {
    // Create a ticket
    const ticket = Ticket.build({ title: 'test ticket', price: 10 });
    await ticket.save();

    // Create an order
    const cookie = await mockAuthenticate();
    await request(app)
      .post(TEST_ROUTE)
      .set('Cookie', cookie)
      .set('Content-Type', 'application/json')
      .send({ ticketId: ticket.id });

    // Create another order
    const response = await request(app)
      .post(TEST_ROUTE)
      .set('Cookie', cookie)
      .set('Content-Type', 'application/json')
      .send({ ticketId: ticket.id });

    expect(response.status).toEqual(400);
  });

  it('returns 201 if order is created', async () => {
    // Create a ticket
    const ticket = Ticket.build({ title: 'test ticket', price: 10 });
    await ticket.save();

    // Create a cookie
    const cookie = await mockAuthenticate();

    // Create an order
    const response = await request(app)
      .post(TEST_ROUTE)
      .set('Cookie', cookie)
      .set('Content-Type', 'application/json')
      .send({ ticketId: ticket.id });

    expect(response.status).toEqual(201);
  });

  it.todo('emits an order created event');
});
