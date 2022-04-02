import { Subjects } from './subjects';
import { Stan } from 'node-nats-streaming';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T['subject'];

  constructor(private client: Stan) {}

  publish(data: T['data']): Promise<void> {
    return new Promise((resolve, reject) => {
      const dataString = JSON.stringify(data);

      this.client.publish(this.subject, dataString, err => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}
