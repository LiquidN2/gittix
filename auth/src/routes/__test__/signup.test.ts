import request from 'supertest';

import { app } from '../../app';

describe('POST /api/users/signup', () => {
  it('returns status 201 on a successful signup', async () => {
    await request(app)
      .post('/api/users/signup')
      .set('Content-Type', 'application/json')
      .send({ email: 'test@test.com', password: 'test' })
      .expect(201);
  });

  it('returns status 400 with invalid email', async () => {
    await request(app)
      .post('/api/users/signup')
      .set('Content-Type', 'application/json')
      .send({ email: 'testtest.com', password: 'test' })
      .expect(400);
  });

  it('returns status 400 with invalid password', async () => {
    await request(app)
      .post('/api/users/signup')
      .set('content-type', 'application/json')
      .send({ email: 'test@test.com', password: 'pw' })
      .expect(400);
  });

  it('returns status 400 with missing email or password', async () => {
    await request(app)
      .post('/api/users/signup')
      .set('Content-Type', 'application/json')
      .send({ email: 'test@test.com' })
      .expect(400);

    await request(app)
      .post('/api/users/signup')
      .set('Content-Type', 'application/json')
      .send({ password: 'abcd1234' })
      .expect(400);
  });

  it('disallows duplicate email', async () => {
    await request(app)
      .post('/api/users/signup')
      .set('Content-Type', 'application/json')
      .send({ email: 'test@test.com', password: 'abcd1234' })
      .expect(201);

    await request(app)
      .post('/api/users/signup')
      .set('Content-Type', 'application/json')
      .send({ email: 'test@test.com', password: 'abcd1234' })
      .expect(400);
  });

  it('sets a cookie after successful signup', async () => {
    const response = await request(app)
      .post('/api/users/signup')
      .set('Content-Type', 'application/json')
      .send({ email: 'test@test.com', password: 'abcd1234' });

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});
