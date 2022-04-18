import request from 'supertest';
import { Types } from 'mongoose';
import { mockAuthenticate, OrderStatus } from '@hngittix/common';

import { app } from '../../app';
import { Order } from '../../models/order';
import { Payment } from '../../models/payment';
// import { stripe } from '../../stripe';

const TEST_ROUTE = '/api/payments';
const STRIPE_TEST_TOKEN = 'tok_visa';
const { ObjectId } = Types;

// jest.mock('../../stripeTs');

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
      .send({ token: STRIPE_TEST_TOKEN });
    expect(response.status).toEqual(400);
  });

  it('returns 404 if order does not exist', async () => {
    const cookie = await mockAuthenticate();
    const response = await request(app)
      .post(TEST_ROUTE)
      .set('Cookie', cookie)
      .send({
        token: STRIPE_TEST_TOKEN,
        orderId: new ObjectId().toHexString(),
      });
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
      .send({
        token: STRIPE_TEST_TOKEN,
        orderId: new ObjectId().toHexString(),
      });
    expect(response.status).toEqual(404);
  });

  it('returns 400 if order is cancelled', async () => {
    // Create Order
    const order = Order.build({
      status: OrderStatus.Cancelled,
      userId: new ObjectId(),
      version: 0,
      price: 10,
    });
    await order.save();

    const cookie = await mockAuthenticate({
      id: order.userId.toHexString(),
      email: 'test@test.com',
    });
    const response = await request(app)
      .post(TEST_ROUTE)
      .set('Cookie', cookie)
      .send({ token: STRIPE_TEST_TOKEN, orderId: order.id });
    expect(response.status).toEqual(400);
  });

  it('returns 201 and create a payment record for successful payment', async () => {
    // Create Order
    const order = Order.build({
      status: OrderStatus.Created,
      userId: new ObjectId(),
      version: 0,
      price: 10,
    });
    await order.save();

    const cookie = await mockAuthenticate({
      id: order.userId.toHexString(),
      email: 'test@test.com',
    });

    const response = await request(app)
      .post(TEST_ROUTE)
      .set('Cookie', cookie)
      .send({ token: 'tok_visa', orderId: order.id });

    expect(response.status).toEqual(201);

    const payment = await Payment.findOne({ order: order.id });
    expect(payment).not.toBeNull();
  });

  it('emits a payment created event', async () => {});

  // it('creates a stripeTs charge with correct order data', async () => {
  //   // Create Order
  //   const order = Order.build({
  //     status: OrderStatus.Created,
  //     userId: new ObjectId(),
  //     version: 0,
  //     price: 10,
  //   });
  //   await order.save();
  //
  //   const cookie = await mockAuthenticate({
  //     id: order.userId.toHexString(),
  //     email: 'test@test.com',
  //   });
  //
  //   await request(app)
  //     .post(TEST_ROUTE)
  //     .set('Cookie', cookie)
  //     .send({ token: 'tok_visa', orderId: order.id });
  //
  //   expect(stripe.charges.create).toHaveBeenCalled();
  //
  //   const chargeData = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  //   expect(chargeData.amount).toEqual(order.price * 100);
  //   expect(chargeData.metadata.orderId).toEqual(order.id.toString());
  //   expect(chargeData.metadata.userId).toEqual(order.userId.toString());
  // });
});
