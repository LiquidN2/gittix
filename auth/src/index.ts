import type { Express } from 'express';
import mongoose from 'mongoose';

import { checkMandatoryEnvSetup, ENV } from './check-env';
import { app } from './app';

interface AppOptions {
  serviceName: string;
}

export const initializeServer = async (
  app: Express,
  { serviceName }: AppOptions
) => {
  checkMandatoryEnvSetup([
    ENV.JWT_SECRET, // required by authenticate middleware
    ENV.JWT_ISSUER, // required by authenticate middleware
    ENV.JWT_AUDIENCE, // required by authenticate middleware
    ENV.JWT_EXPIRATION_TIME, // required by authenticate middleware
    ENV.MONGODB_URI, // required for MongoDB connection
  ]);

  // Connect to DB
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log(`🤝🤝🤝 Connected to ${serviceName} DB 🤝🤝🤝`);
  } catch (e) {
    console.error(`💥💥💥 Unable to connect to ${serviceName} DB`, e);
  }

  // Start the server
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(
      `✅✅✅ ${serviceName} service is listening on port ${PORT} ✅✅✅`
    );
  });
};

const SERVICE_NAME = 'AUTH';

initializeServer(app, {
  serviceName: SERVICE_NAME,
}).catch(e =>
  console.error(
    `💥💥💥 Something went wrong with ${SERVICE_NAME} service 💥💥💥`,
    e
  )
);
