import express from 'express';
import cookieSession from 'cookie-session';
import 'express-async-errors';

import { NotFoundError, errorHandler } from '@hngittix/common';
import { currentUserRouter } from './routes/current-user';
import { signupRouter } from './routes/signup';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';

const app = express();

app.set('trust proxy', true);

// -----------------------
// GLOBAL MIDDLEWARES
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cookieSession({
    name: process.env.COOKIE_SESSION_NAME,
    signed: false, // encryption to be handled by JWT
    secure: process.env.NODE_ENV !== 'test', // send cookie via HTTPS only
  })
);

// -----------------------
// ERROR HANDLERS
app.use(currentUserRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);

// -----------------------
// ERROR HANDLERS
app.all('*', async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
