import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@hngittix/common';

import { QueueGroupName } from './queue-group-name';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;

  queueGroupName = QueueGroupName.ModerationService;

  async onMessage(eventData: OrderCreatedEvent['data'], msg: Message) {
    const delay =
      new Date(eventData.expiresAt).getTime() - new Date().getTime(); // in milliseconds

    // Create a job
    await expirationQueue.add({ orderId: eventData.id }, { delay });

    // Acknowledges the message
    msg.ack();
  }
}
