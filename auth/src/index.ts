import express from 'express';
import mongoose from 'mongoose';
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

// APP INITIALIZATION
const init = async () => {
  // Check for environment variables
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET must be defined');
  if (!process.env.JWT_ISSUER) throw new Error('JWT_ISSUER must be defined');
  if (!process.env.JWT_AUDIENCE)
    throw new Error('JWT_AUDIENCE must be defined');
  if (!process.env.JWT_EXPIRATION_TIME)
    throw new Error('JWT_EXPIRATION_TIME must be defined');

  // Connect to DB
  try {
    console.log('Connecting to db...');
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log('🤝🤝🤝 Connected to AUTHENTICATION DATABASE 🤝🤝🤝');
  } catch (e) {
    console.error(e);
  }

  // Start the server
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(
      `✅✅✅ AUTHENTICATION SERVICE is listening on port ${PORT} ✅✅✅`
    );
  });
};

init();
