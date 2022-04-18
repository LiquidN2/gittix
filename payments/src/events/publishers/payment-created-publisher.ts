import { PaymentCreatedEvent, Publisher, Subjects } from '@hngittix/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
