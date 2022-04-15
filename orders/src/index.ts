import type { Express } from 'express';
import mongoose from 'mongoose';

import { checkMandatoryEnvSetup, ENV } from './check-env';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';

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
    ENV.NATS_URL, // required by NATS
    ENV.NATS_CLUSTER_ID, // required by NATS
    ENV.NATS_CLIENT_ID, // required by NATS
  ]);

  // Connect to DB
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log(`🤝🤝🤝 Connected to ${serviceName} DB 🤝🤝🤝`);
  } catch (e) {
    console.error(`💥💥💥 Unable to connect to ${serviceName} DB`, e);
  }

  // Connect to NATS
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URL!
    );
    console.log('🤝🤝🤝 Connected to NATS 🤝🤝🤝');

    // CLose NATS connection upon signal interruption and termination
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    // Event Listeners
    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();
  } catch (e) {
    console.error('Unable to connect to NATS', e);
  }

  // Start the server
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(
      `✅✅✅ ${serviceName} service is listening on port ${PORT} ✅✅✅`
    );
  });
};

const SERVICE_NAME = 'ORDERS';

initializeServer(app, {
  serviceName: SERVICE_NAME,
}).catch(e =>
  console.error(
    `💥💥💥 Something went wrong with ${SERVICE_NAME} service 💥💥💥`,
    e
  )
);
