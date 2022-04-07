import request from 'supertest';
import { Types } from 'mongoose';
import { mockAuthenticate, OrderStatus } from '@hngittix/common';

import { app } from '../../app';
import { Ticket } from '../../models/ticket';

const TEST_ROUTE = '/api/orders';
const { ObjectId } = Types;

describe(`DELETE ${TEST_ROUTE}/:id`, () => {
  it('has a route handler', async () => {
    const response = await request(app)
      .del(`${TEST_ROUTE}/${new ObjectId()}`)
      .send({});
    expect(response.status).not.toEqual(404);
  });

  it('only allows authenticated request', async () => {
    const response = await request(app)
      .del(`${TEST_ROUTE}/${new ObjectId()}`)
      .send({});
    expect(response.status).toEqual(401);
  });

  it('returns order status canceled upon successful request', async () => {
    // Create a ticket
    const ticket = Ticket.build({ title: 'test ticket', price: 10 });
    await ticket.save();

    // Make an order
    const cookie = await mockAuthenticate();
    const orderRes = await request(app)
      .post(TEST_ROUTE)
      .set('Cookie', cookie)
      .set('Content-Type', 'application/json')
      .send({ ticketId: ticket.id });

    const orderId = orderRes.body.id;

    // Fetch order
    const response = await request(app)
      .del(`${TEST_ROUTE}/${orderId}`)
      .set('Cookie', cookie)
      .send({});
    expect(response.status).toEqual(200);
    expect(response.body.status).toEqual(OrderStatus.Canceled);
  });

  it.todo('emits event when order is deleted');
});
