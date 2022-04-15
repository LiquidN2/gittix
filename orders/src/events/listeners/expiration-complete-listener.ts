import { Message } from 'node-nats-streaming';
import {
  Listener,
  Subjects,
  ExpirationCompleteEvent,
  OrderStatus,
} from '@hngittix/common';

import { QueueGroupName } from './queue-group-name';
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = QueueGroupName.OrdersService;

  async onMessage(eventData: ExpirationCompleteEvent['data'], msg: Message) {
    // Find the order
    const order = await Order.findById(eventData.orderId).populate('ticket');
    if (!order) throw new Error('Order not found');

    // Cancel the order
    order.status = OrderStatus.Cancelled;
    const cancelledOrder = await order.save();

    // Emits order cancel event
    await new OrderCancelledPublisher(this.client).publish({
      id: cancelledOrder.id.toString(),
      userId: cancelledOrder.userId.toString(),
      expiresAt: cancelledOrder.expiresAt.toISOString(),
      status: cancelledOrder.status,
      ticket: {
        id: cancelledOrder.ticket.id,
        price: cancelledOrder.ticket.price,
      },
      version: cancelledOrder.version,
    });

    // acknowledges message
    msg.ack();
  }
}
