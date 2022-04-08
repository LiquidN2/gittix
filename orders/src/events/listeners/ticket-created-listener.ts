import { Message } from 'node-nats-streaming';
import { Listener, Subjects, TicketCreatedEvent } from '@hngittix/common';

import { QueueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = QueueGroupName.OrdersService;

  async onMessage(eventData: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = eventData;

    // Save a copy of the ticket to db
    const ticket = Ticket.build({ id, title, price });
    await ticket.save();

    // Manually acknowledge the event
    msg.ack();
  }
}
