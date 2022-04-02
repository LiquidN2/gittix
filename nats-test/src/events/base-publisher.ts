import { Subjects } from './subjects';
import { Stan } from 'node-nats-streaming';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T['subject'];

  constructor(private client: Stan) {}

  publish(
    data: T['data'],
    callBack: () => void = () =>
      console.log(`Event - ${this.subject} - published`)
  ) {
    const dataString = JSON.stringify(data);
    this.client.publish(this.subject, dataString, callBack);
  }
}
