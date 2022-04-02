import { Message } from 'node-nats-streaming';
import { Listener } from './base-listener';

export class TicketCreatedListener extends Listener {
  subject = 'ticket:created';
  queueGroupName = 'ticket-created';
  onMessage(eventData: any, msg: Message) {
    console.log('Event data:', eventData);
  }
}
