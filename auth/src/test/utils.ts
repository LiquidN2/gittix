import request from 'supertest';

import { app } from '../app';
import { User } from '../models/user';

export const mockUserData = { email: 'test@test.com', password: 'abcd1234' };

export const setupMockUser = async () => {
  const user = User.build(mockUserData);
  return await user.save();
};

export const userSignIn = (email?: string, password?: string) =>
  request(app)
    .post('/api/users/signin')
    .set('Content-Type', 'application/json')
    .send({ email, password });

export const userSignUp = (email?: string, password?: string) =>
  request(app)
    .post('/api/users/signup')
    .set('Content-Type', 'application/json')
    .send({ email, password });
