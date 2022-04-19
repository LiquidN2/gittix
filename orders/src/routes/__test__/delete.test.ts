import request from 'supertest';
import { Types } from 'mongoose';
import { mockAuthenticate, OrderStatus } from '@hngittix/common';

import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

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

  it('returns status 400 if order is already complete', async () => {
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

    // Changes order status to complete
    const order = await Order.findById(orderId);
    order!.status = OrderStatus.Complete;
    const completedOrder = await order!.save();

    // Request order cancellation
    const response = await request(app)
      .del(`${TEST_ROUTE}/${orderId}`)
      .set('Cookie', cookie)
      .send({});
    expect(response.status).toEqual(400);
  });

  it('returns order with status canceled upon successful request', async () => {
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

    // Cancel order
    const response = await request(app)
      .del(`${TEST_ROUTE}/${orderId}`)
      .set('Cookie', cookie)
      .send({});
    expect(response.status).toEqual(200);
    expect(response.body.status).toEqual(OrderStatus.Cancelled);
  });

  it('emits event when order is deleted', async () => {
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

    jest.clearAllMocks();

    const orderId = orderRes.body.id;

    // Cancel order
    const response = await request(app)
      .del(`${TEST_ROUTE}/${orderId}`)
      .set('Cookie', cookie)
      .send({});

    const order = response.body;

    // assert event publisher has been called
    expect(natsWrapper.client.publish).toHaveBeenCalled();

    // access the eventData
    const eventData = JSON.parse(
      (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    );

    // asserts the event publisher was called with correct data
    expect(order).toMatchObject(eventData);
  });
});
