import { Message } from 'node-nats-streaming';
import { TicketCreatedEvent } from '@hngittix/common';
import { Types } from 'mongoose';

import { TicketCreatedListener } from '../ticket-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const { ObjectId } = Types;

describe('Event Listeners - Ticket Created', () => {
  const setup = async () => {
    // create instance of the listener
    const listener = new TicketCreatedListener(natsWrapper.client);

    // create fake event data
    const data: TicketCreatedEvent['data'] = {
      id: new ObjectId().toHexString(),
      title: 'test ticket',
      price: 15,
      userId: new ObjectId().toHexString(),
      version: 0,
    };

    // create a fake message obj
    // @ts-ignore
    const msg: Message = {
      ack: jest.fn(),
    };

    return { listener, data, msg };
  };

  it('creates and saves a ticket', async () => {
    const { listener, data, msg } = await setup();

    // call the onMessage function with event data & message obj
    await listener.onMessage(data, msg);

    // assert a ticket is created
    const tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
  });

  it('acknowledges the message', async () => {
    const { listener, data, msg } = await setup();

    // call the onMessage function with event data & message obj
    await listener.onMessage(data, msg);

    // assert the message is acknowledged
    expect(msg.ack).toHaveBeenCalled();
  });
});
