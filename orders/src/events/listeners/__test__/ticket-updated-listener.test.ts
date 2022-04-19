import { Message } from 'node-nats-streaming';
import { TicketUpdatedEvent } from '@hngittix/common';
import { Types } from 'mongoose';

import { TicketUpdatedListener } from '../ticket-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const { ObjectId } = Types;

describe('Event Listener - Ticket Updated', () => {
  const setup = async () => {
    // create an instance of event listener
    const listener = new TicketUpdatedListener(natsWrapper.client);

    // create a ticket
    const ticket = Ticket.build({ title: 'test ticket title', price: 10 });
    await ticket.save();

    // create fake event data
    const data: TicketUpdatedEvent['data'] = {
      id: ticket.id,
      title: 'updated title',
      price: 15,
      userId: new ObjectId().toHexString(),
      version: 1,
      orderId: null,
    };

    // create fake message obj
    // @ts-ignore
    const msg: Message = {
      ack: jest.fn(),
    };

    return { listener, data, msg };
  };

  it('throws error if ticket does not exist', async () => {
    const { listener, data, msg } = await setup();

    const newData: TicketUpdatedEvent['data'] = {
      ...data,
      id: new ObjectId().toHexString(),
    };

    await expect(listener.onMessage(newData, msg)).rejects.toThrow(
      'Ticket not found'
    );
  });

  it('throws error if event is out of order', async () => {
    const { listener, data, msg } = await setup();

    const newData: TicketUpdatedEvent['data'] = {
      ...data,
      version: 2,
    };

    await expect(listener.onMessage(newData, msg)).rejects.toThrow(
      'Ticket not found'
    );
  });

  it('updates an existing ticket', async () => {
    const { listener, data, msg } = await setup();

    // call the onMessage function with event data and message object
    await listener.onMessage(data, msg);

    // assert ticket is updated
    const updatedTicket = await Ticket.findById(data.id);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.version).toEqual(data.version);
  });

  it('acknowledges the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});
