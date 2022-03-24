import request from 'supertest';

import { app } from '../../app';
import { userSignUp } from '../../test/utils';

describe('POST /api/users/signout', () => {
  // -------------------------
  // SUCCESSFUL REQUESTS
  it('returns status 200 on successful signout', async () => {
    await userSignUp('test@test.com', 'test');

    const response = await request(app).post('/api/users/signout');
    expect(response.status).toEqual(200);
  });

  it('unset cookie on successful signout', async () => {
    await userSignUp('test@test.com', 'test');

    const response = await request(app).post('/api/users/signout');
    const cookieHeader = response.get('Set-Cookie').toString();
    const [cookie] = cookieHeader.split(';');
    const [, jwt] = cookie.split('=');
    expect(jwt).toBe('');
  });
});
