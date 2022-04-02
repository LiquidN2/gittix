import { Message } from 'node-nats-streaming';
import { Listener } from './base-listener';

import { Subjects } from './subjects';
import { TicketCreatedEvent } from './ticket-created-event';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: TicketCreatedEvent['subject'] = Subjects.TicketCreated;

  queueGroupName = 'payment-service';

  onMessage(eventData: TicketCreatedEvent['data'], msg: Message) {
    console.log('Event data:', eventData);
  }
}
