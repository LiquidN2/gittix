import { Message } from 'node-nats-streaming';
import {
  Listener,
  Subjects,
  PaymentCreatedEvent,
  OrderStatus,
} from '@hngittix/common';

import { QueueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = QueueGroupName.OrdersService;
  async onMessage(eventData: PaymentCreatedEvent['data'], msg: Message) {
    // Look up the order
    const order = await Order.findById(eventData.orderId);
    if (!order) throw new Error('Order not found');
    if (order.status === OrderStatus.Cancelled)
      throw new Error('Cannot complete a cancelled order');

    // Changes the order status to complete
    order.status = OrderStatus.Complete;
    await order.save();

    // Acknowledges the message
    msg.ack();
  }
}
