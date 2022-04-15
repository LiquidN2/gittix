import request from 'supertest';
import { mockAuthenticate } from '@hngittix/common';
import { app } from '../app';

export const createTicket = async () => {
  const cookie = await mockAuthenticate();
  const response = await request(app)
    .post('/api/tickets')
    .set('Content-Type', 'application/json')
    .set('Cookie', cookie)
    .send({ title: 'test ticket', price: 10 });

  jest.clearAllMocks();

  return { cookie, response };
};
