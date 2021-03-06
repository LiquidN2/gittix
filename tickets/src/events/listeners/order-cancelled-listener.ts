import { Message } from 'node-nats-streaming';
import { Listener, OrderCancelledEvent, Subjects } from '@hngittix/common';

import { QueueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = QueueGroupName.TicketService;

  async onMessage(eventData: OrderCancelledEvent['data'], msg: Message) {
    // Get ticket id from event data
    const {
      ticket: { id: ticketId },
    } = eventData;

    // Find the ticket
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new Error('Ticket not found');

    // Set orderId to null
    ticket.orderId = null;
    const updatedTicket = await ticket.save();

    // Emits ticket update event
    await new TicketUpdatedPublisher(this.client).publish({
      id: updatedTicket.id,
      title: updatedTicket.title,
      price: updatedTicket.price,
      userId: updatedTicket.userId.toString(),
      version: updatedTicket.version,
      orderId: updatedTicket.orderId?.toString() || null,
    });

    // Acknowledge the event
    msg.ack();
  }
}
