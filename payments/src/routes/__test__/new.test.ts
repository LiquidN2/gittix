import request from 'supertest';
import { Types } from 'mongoose';
import { mockAuthenticate, OrderStatus } from '@hngittix/common';

import { app } from '../../app';
import { Order } from '../../models/order';

const TEST_ROUTE = '/api/payments';
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

  it('returns 400 if token is missing', async () => {
    const cookie = await mockAuthenticate();
    const response = await request(app)
      .post(TEST_ROUTE)
      .set('Cookie', cookie)
      .send({ orderId: new ObjectId().toHexString() });
    expect(response.status).toEqual(400);
  });

  it('returns 400 if orderId is missing', async () => {
    const cookie = await mockAuthenticate();
    const response = await request(app)
      .post(TEST_ROUTE)
      .set('Cookie', cookie)
      .send({ token: 'token' });
    expect(response.status).toEqual(400);
  });

  it('returns 404 if order does not exist', async () => {
    const cookie = await mockAuthenticate();
    const response = await request(app)
      .post(TEST_ROUTE)
      .set('Cookie', cookie)
      .send({ token: 'token', orderId: new ObjectId().toHexString() });
    expect(response.status).toEqual(404);
  });

  it('returns 401 if request is not from user who created the order', async () => {
    // Create Order
    const order = Order.build({
      status: OrderStatus.Created,
      userId: new ObjectId(),
      version: 0,
      price: 10,
    });
    return order.save();

    const cookie = await mockAuthenticate();
    const response = await request(app)
      .post(TEST_ROUTE)
      .set('Cookie', cookie)
      .send({ token: 'token', orderId: new ObjectId().toHexString() });
    expect(response.status).toEqual(404);
  });

  it('returns 400 if order is cancelled', async () => {
    // Create Order
    const order = Order.build({
      status: OrderStatus.Created,
      userId: new ObjectId(),
      version: 0,
      price: 10,
    });
    return order.save();

    const cookie = await mockAuthenticate({
      id: order.userId.toHexString(),
      email: 'test@test.com',
    });
    const response = await request(app)
      .post(TEST_ROUTE)
      .set('Cookie', cookie)
      .send({ token: 'token', orderId: order.id });
    expect(response.status).toEqual(400);
  });
});
