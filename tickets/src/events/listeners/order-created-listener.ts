import { Types } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@hngittix/common';

import { QueueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';
// import { natsWrapper } from '../../nats-wrapper';

const { ObjectId } = Types;

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = QueueGroupName.TicketService;

  async onMessage(eventData: OrderCreatedEvent['data'], msg: Message) {
    // Get ticket id from event data
    const {
      id: orderId,
      ticket: { id: ticketId },
    } = eventData;

    // check if ticket exists
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new Error('Ticket not found');

    // save the ticket with order id
    ticket.orderId = new ObjectId(orderId);
    const updatedTicket = await ticket.save();

    // emits ticket updated event
    await new TicketUpdatedPublisher(this.client).publish({
      id: updatedTicket._id,
      title: updatedTicket.title,
      price: updatedTicket.price,
      userId: updatedTicket.userId.toString(),
      version: updatedTicket.version,
      orderId: updatedTicket.orderId?.toString() || null,
    });

    // acknowledges the message
    msg.ack();
  }
}
