import { Types } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@hngittix/common';

import { QueueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

const { ObjectId } = Types;

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = QueueGroupName.PaymentsService;

  async onMessage(eventData: OrderCreatedEvent['data'], msg: Message) {
    // Create Order
    const order = Order.build({
      id: new ObjectId(eventData.id),
      userId: new ObjectId(eventData.userId),
      status: eventData.status,
      price: eventData.ticket.price,
      version: eventData.version,
    });
    await order.save();

    // Acknowledges the message
    msg.ack();
  }
}
