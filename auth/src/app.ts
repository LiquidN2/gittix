import express from 'express';
import cookieSession from 'cookie-session';
import 'express-async-errors';

import { currentUserRouter } from './routes/current-user';
import { signupRouter } from './routes/signup';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { NotFoundError } from './errors/not-found-error';

import { errorHandler } from './middlewares/error-handler';

const app = express();

app.set('trust proxy', true);

// GLOBAL MIDDLEWARES
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cookieSession({
    name: 'gittix-session',
    signed: false, // encryption to be handled by JWT
    secure: true, // send cookie via HTTPS only
  })
);

// ROUTE HANDLERS
app.use(currentUserRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.all('*', async () => {
  throw new NotFoundError();
});

// ERROR HANDLERS
app.use(errorHandler);

export { app };
