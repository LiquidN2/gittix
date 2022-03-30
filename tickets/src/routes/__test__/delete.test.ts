import request from 'supertest';

import { app } from '../../app';
import { createTicket, mockAuthenticate } from '../../test/utils';

const TEST_ROUTE = '/api/tickets';

describe(`DELETE ${TEST_ROUTE}/:id`, () => {
  it('has a route handler listening', async () => {
    const response = await request(app)
      .delete(`${TEST_ROUTE}/someticketid`)
      .send({});

    expect(response.status).not.toEqual(404);
  });

  it('returns status 401 if request is unauthenticated', async () => {
    const response = await request(app)
      .delete(`${TEST_ROUTE}/someticketid`)
      .send({});
    expect(response.status).toEqual(401);
  });

  it('returns status 400 if ticket id is invalid', async () => {
    const { cookie } = await createTicket();

    const response = await request(app)
      .delete(`${TEST_ROUTE}/someticketid`)
      .set('Cookie', cookie)
      .send({});
    expect(response.status).toEqual(400);
  });

  it('returns status 400 if delete request is not from the ticket creator', async () => {
    const { response: createTixRes } = await createTicket();

    const newCookie = await mockAuthenticate();

    const response = await request(app)
      .delete(`${TEST_ROUTE}/${createTixRes.body.id}`)
      .set('Cookie', newCookie)
      .send();
    expect(response.status).toEqual(400);
  });

  it('returns status 200 if ticket is deleted', async () => {
    const { response: createTixRes, cookie } = await createTicket();

    const response = await request(app)
      .delete(`${TEST_ROUTE}/${createTixRes.body.id}`)
      .set('Cookie', cookie)
      .send();
    expect(response.status).toEqual(200);
  });
});
