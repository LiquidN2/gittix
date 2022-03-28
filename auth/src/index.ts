import { initializeServer } from '@hngittix/common';
import { app } from './app';

const SERVICE_NAME = 'AUTH';

initializeServer(app, { serviceName: SERVICE_NAME }).catch(error =>
  console.error(
    `💥💥💥 Something went wrong with ${SERVICE_NAME} service 💥💥💥`,
    error
  )
);
