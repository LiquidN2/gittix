import { Message } from 'node-nats-streaming';
import { Listener } from './base-listener';

import { Subjects } from './subjects';
import { TicketUpdatedEvent } from './ticket-updated-event';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;

  queueGroupName = 'payment-service';

  onMessage(eventData: TicketUpdatedEvent['data'], msg: Message) {
    console.log('Event data:', eventData);
  }
}
