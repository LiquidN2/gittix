import request from 'supertest';

import { app } from '../../app';
import { userSignUp } from '../../test/utils';

describe('GET /api/users/current-user', () => {
  // ---------------------
  // SUCCESSFUL REQUEST
  it('returns status 200 on successful request', async () => {
    const signUpRes = await userSignUp('test@test.com', 'abcd1234');
    const cookie = signUpRes.get('Set-Cookie');

    const response = await request(app)
      .get('/api/users/currentuser')
      .set('Cookie', cookie)
      .send();
    expect(response.status).toEqual(200);
  });

  // ---------------------
  // FAILED REQUESTS
  it('returns status 401 on unauthenticated request', async () => {
    const response = await request(app).get('/api/users/currentuser').send();
    expect(response.status).toEqual(401);
  });
});
