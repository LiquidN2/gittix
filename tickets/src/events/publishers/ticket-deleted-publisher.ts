import { Publisher, Subjects, TicketDeletedEvent } from '@hngittix/common';

export class TicketDeletedPublisher extends Publisher<TicketDeletedEvent> {
  subject: Subjects.TicketDelete = Subjects.TicketDelete;
}
