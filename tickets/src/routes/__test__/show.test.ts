import request from 'supertest';
import { Types } from 'mongoose';

import { app } from '../../app';
import { createTicket } from '../../test/utils';

jest.mock('../../nats-wrapper');

const { ObjectId } = Types;
const TEST_ROUTE = '/api/tickets';

describe(`GET ${TEST_ROUTE}`, () => {
  it('has a handler listening', async () => {
    const response = await request(app).get(TEST_ROUTE).send();
    expect(response).not.toEqual(404);
  });

  it("returns empty array if there's no ticket", async () => {
    const response = await request(app).get(TEST_ROUTE).send();
    expect(response.status).toEqual(200);
    expect(response.body.tickets.length).toEqual(0);
  });

  it('returns an array if ticket(s) found', async () => {
    // create 2 tickets
    await createTicket();
    await createTicket();

    // validate if fetch 2 tickets
    const response = await request(app).get(TEST_ROUTE).send();
    expect(response.status).toEqual(200);
    expect(response.body.tickets.length).toEqual(2);
  });
});

describe(`GET ${TEST_ROUTE}/:id`, () => {
  it('has a handler listening', async () => {
    const response = await request(app)
      .get(`${TEST_ROUTE}/someticketid`)
      .send();
    expect(response).not.toEqual(404);
  });

  it('returns status 404 if no ticket found', async () => {
    const ticketId = new ObjectId();
    const response = await request(app).get(`${TEST_ROUTE}/${ticketId}`).send();
    expect(response.status).toEqual(404);
  });

  it('returns status 200 if requested ticket found', async () => {
    // create 2 tickets
    const { response: createTixRes } = await createTicket();
    await createTicket();

    const response = await request(app)
      .get(`${TEST_ROUTE}/${createTixRes.body.id}`)
      .send();
    expect(response.status).toEqual(200);
    expect(response.body.ticket).toBeDefined();
  });
});
