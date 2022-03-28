import mongoose from 'mongoose';

import { app } from './app';

// APP INITIALIZATION
const init = async () => {
  // Check for environment variables
  // if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET must be defined');
  // if (!process.env.JWT_ISSUER) throw new Error('JWT_ISSUER must be defined');
  // if (!process.env.JWT_AUDIENCE)
  //   throw new Error('JWT_AUDIENCE must be defined');
  // if (!process.env.JWT_EXPIRATION_TIME)
  //   throw new Error('JWT_EXPIRATION_TIME must be defined');

  const PORT = 3000;
  const SERVICE_NAME = 'TICKETS';

  // Connect to DB
  // try {
  //   console.log('Connecting to db...');
  //   await mongoose.connect('mongodb://tickets-mongo-srv:27017/tickets');
  //   console.log(`🤝🤝🤝 Connected to ${SERVICE_NAME} DB 🤝🤝🤝`);
  // } catch (e) {
  //   console.error(e);
  // }

  // Start the server
  app.listen(PORT, () => {
    console.log(
      `✅✅✅ ${SERVICE_NAME} service is listening on port ${PORT} ✅✅✅`
    );
  });
};

init();
