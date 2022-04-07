import { Publisher, Subjects, OrderCreatedEvent } from '@hngittix/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
