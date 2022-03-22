import express from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';

import { currentUserRouter } from './routes/current-user';
import { signupRouter } from './routes/signup';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { NotFoundError } from './errors/not-found-error';

import { errorHandler } from './middlewares/error-handler';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route Handlers
app.use(currentUserRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

// Error Handlers
app.use(errorHandler);

const init = async () => {
  // Connect to DB
  try {
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
