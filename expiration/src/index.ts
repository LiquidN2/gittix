import { checkMandatoryEnvSetup, ENV } from './check-env';
import { natsWrapper } from './nats-wrapper';

export const initializeApp = async () => {
  checkMandatoryEnvSetup([
    ENV.NATS_URL, // required by NATS
    ENV.NATS_CLUSTER_ID, // required by NATS
    ENV.NATS_CLIENT_ID, // required by NATS
  ]);

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
  } catch (e) {
    console.error('Unable to connect to NATS', e);
  }
};

const SERVICE_NAME = 'MODERATION';

initializeApp().catch(e =>
  console.error(
    `💥💥💥 Something went wrong with ${SERVICE_NAME} service 💥💥💥`,
    e
  )
);
