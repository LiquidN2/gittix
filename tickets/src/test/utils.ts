import { generateUserJwt, UserPayLoad } from '@hngittix/common';
import { Types } from 'mongoose';
import request from 'supertest';
import { app } from '../app';

export const mockAuthenticate = async (userPayload?: UserPayLoad) => {
  // Create a userId that is of mongo object id format
  const userId = new Types.ObjectId().toString();

  // Create a payload
  const payload = userPayload
    ? userPayload
    : { id: userId, email: 'test@test.com' };

  // Create JWT
  const jwt = await generateUserJwt(payload);

  // Create session object
  const session = { jwt };

  // Convert session to JSON
  const sessionJSON = JSON.stringify(session);

  // Encode base 64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // Return cookie
  return `gittix-session=${base64}`;
};

export const createTicket = async () => {
  const cookie = await mockAuthenticate();
  const response = await request(app)
    .post('/api/tickets')
    .set('Content-Type', 'application/json')
    .set('Cookie', cookie)
    .send({ title: 'test ticket', price: 10 });

  return { cookie, response };
};
