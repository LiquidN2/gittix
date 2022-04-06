import request from 'supertest';

import { app } from '../../app';

const TEST_ROUTE = '/api/orders';

describe(`POST ${TEST_ROUTE}`, () => {
  it('has a route handler', async () => {
    const response = await request(app).post(TEST_ROUTE).send({});
    expect(response.status).not.toEqual(404);
  });

  it('only allows authenticated request', async () => {
    const response = await request(app).post(TEST_ROUTE).send({});
    expect(response.status).toEqual(401);
  });
});
