import request from 'supertest';
import { mockAuthenticate } from '@hngittix/common';

import { app } from '../../app';
import { Ticket } from '../../models/ticket';

const TEST_ROUTE = '/api/orders';

describe(`GET ${TEST_ROUTE}`, () => {
  it('has a route handler', async () => {
    const response = await request(app).get(TEST_ROUTE).send({});
    expect(response.status).not.toEqual(404);
  });

  it('only allows authenticated request', async () => {
    const response = await request(app).get(TEST_ROUTE).send({});
    expect(response.status).toEqual(401);
  });

  it('returns 200 upon successful request', async () => {
    // Create 3 tickets
    const ticketOne = Ticket.build({ title: 'test ticket', price: 10 });
    await ticketOne.save();

    const ticketTwo = Ticket.build({ title: 'test ticket two', price: 23 });
    await ticketTwo.save();

    const ticketThree = Ticket.build({ title: 'test ticket three', price: 38 });
    await ticketThree.save();

    // User #1 order 1 ticket
    const cookieUserOne = await mockAuthenticate();
    await request(app)
      .post(TEST_ROUTE)
      .set('Cookie', cookieUserOne)
      .set('Content-Type', 'application/json')
      .send({ ticketId: ticketTwo.id });

    // User #2 order 2 tickets
    const cookieUserTwo = await mockAuthenticate();
    await request(app)
      .post(TEST_ROUTE)
      .set('Cookie', cookieUserTwo)
      .set('Content-Type', 'application/json')
      .send({ ticketId: ticketOne.id });

    await request(app)
      .post(TEST_ROUTE)
      .set('Cookie', cookieUserTwo)
      .set('Content-Type', 'application/json')
      .send({ ticketId: ticketThree.id });

    // Fetch orders for User #2
    const response = await request(app)
      .get(TEST_ROUTE)
      .set('Cookie', cookieUserTwo)
      .send({});
    expect(response.status).toEqual(200);
    expect(response.body.length).toEqual(2);
  });
});
