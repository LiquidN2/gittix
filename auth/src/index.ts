import type { Express } from 'express';
import mongoose from 'mongoose';

import { app } from './app';

interface AppOptions {
  serviceName: string;
  natsConnectionEnabled: boolean;
}

export const initializeServer = async (
  app: Express,
  { serviceName, natsConnectionEnabled }: AppOptions
) => {
  // JWT env required by @hngittix/common
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET must be defined');
  if (!process.env.JWT_ISSUER) throw new Error('JWT_ISSUER must be defined');
  if (!process.env.JWT_AUDIENCE)
    throw new Error('JWT_AUDIENCE must be defined');
  if (!process.env.JWT_EXPIRATION_TIME)
    throw new Error('JWT_EXPIRATION_TIME must be defined');

  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI must be defined');

  const PORT = 3000;

  // Connect to DB
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`🤝🤝🤝 Connected to ${serviceName} DB 🤝🤝🤝`);
  } catch (e) {
    console.error(`💥💥💥 Unable to connect to ${serviceName} DB`, e);
  }

  // Start the server
  app.listen(PORT, () => {
    console.log(
      `✅✅✅ ${serviceName} service is listening on port ${PORT} ✅✅✅`
    );
  });
};

const SERVICE_NAME = 'AUTH';

initializeServer(app, {
  serviceName: SERVICE_NAME,
  natsConnectionEnabled: false,
}).catch(e =>
  console.error(
    `💥💥💥 Something went wrong with ${SERVICE_NAME} service 💥💥💥`,
    e
  )
);
