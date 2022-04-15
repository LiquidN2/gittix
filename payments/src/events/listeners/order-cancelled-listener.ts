// import { Types } from 'mongoose';
import { Message } from 'node-nats-streaming';
import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from '@hngittix/common';

import { QueueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

// const { ObjectId } = Types;

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = QueueGroupName.PaymentsService;

  async onMessage(eventData: OrderCancelledEvent['data'], msg: Message) {
    // Lookup order based on id & version
    const order = await Order.findByEventData(eventData);
    if (!order) throw new Error('Order not found');

    // Change order status to 'cancelled'
    order.status = OrderStatus.Cancelled;
    const cancelledOrder = await order.save();

    // Acknowledges the message
    msg.ack();
  }
}
