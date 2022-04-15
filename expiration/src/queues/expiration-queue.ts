import Queue from 'bull';

import { natsWrapper } from '../nats-wrapper';
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher';

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async job => {
  // console.log(
  //   'Publish expiration:complete event for orderId',
  //   job.data.orderId
  // );

  // get order id
  const { orderId } = job.data;

  // emits event
  await new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId,
  });
});

export { expirationQueue };
