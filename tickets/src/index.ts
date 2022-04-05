// import { initializeServer } from '@hngittix/common';
// import { app } from './app';
//
// const SERVICE_NAME = 'TICKETS';
//
// initializeServer(app, {
//   serviceName: SERVICE_NAME,
//   natsConnectionEnabled: true,
// }).catch(error =>
//   console.error(
//     `💥💥💥 Something went wrong with ${SERVICE_NAME} service 💥💥💥`,
//     error
//   )
// );

import type { Express } from 'express';
import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrapper';

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

  // Connect to NATS
  if (natsConnectionEnabled) {
    if (!process.env.NATS_URL) throw new Error('NATS_URL must be defined');
    if (!process.env.NATS_CLUSTER_ID)
      throw new Error('NATS_CLUSTER_ID must be defined');
    if (!process.env.NATS_CLIENT_ID)
      throw new Error('NATS_CLIENT_ID must be defined');

    try {
      await natsWrapper.connect(
        process.env.NATS_CLUSTER_ID,
        process.env.NATS_CLIENT_ID,
        process.env.NATS_URL
      );
      console.log('🤝🤝🤝 Connected to NATS 🤝🤝🤝');

      // CLose NATS connection upon signal interruption and termination
      natsWrapper.client.on('close', () => {
        console.log('NATS connection closed!');
        process.exit();
      });
      process.on('SIGINT', () => natsWrapper.client.close());
      process.on('SIGTERM', () => natsWrapper.client.close());
    } catch (e) {
      console.error('Unable to connect to NATS', e);
    }
  }

  // Start the server
  app.listen(PORT, () => {
    console.log(
      `✅✅✅ ${serviceName} service is listening on port ${PORT} ✅✅✅`
    );
  });
};

const SERVICE_NAME = 'TICKETS';

initializeServer(app, {
  serviceName: 'TICKETS',
  natsConnectionEnabled: true,
}).catch(e =>
  console.error(
    `💥💥💥 Something went wrong with ${SERVICE_NAME} service 💥💥💥`,
    e
  )
);
