import { Message } from 'node-nats-streaming';
import {
  Listener,
  Subjects,
  TicketUpdatedEvent,
  OrderStatus,
} from '@hngittix/common';

import { QueueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { Order } from '../../models/order';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = QueueGroupName.OrdersService;

  async onMessage(eventData: TicketUpdatedEvent['data'], msg: Message) {
    const { title, price, orderId } = eventData;

    // Find the ticket
    const ticket = await Ticket.findByEventData(eventData);
    if (!ticket) throw new Error('Ticket not found');

    // Update the ticket
    ticket.set({ title, price });
    await ticket.save();

    // If the ticket event data has orderId (ticket is reserved), change order status to awaiting payment
    if (orderId) {
      const order = await Order.findById(orderId);

      if (!order) throw new Error('Order not found');
      if (order.status === OrderStatus.Cancelled)
        throw new Error('Order was cancelled');
      if (order.status === OrderStatus.Complete)
        throw new Error('Order already paid for');

      order.status = OrderStatus.AwaitingPayment;
      await order.save();
    }

    msg.ack();
  }
}
