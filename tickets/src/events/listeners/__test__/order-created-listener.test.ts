import { Types } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrderStatus } from '@hngittix/common';

import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const { ObjectId } = Types;

describe('Event Listener: Order Created', () => {
  const setup = async () => {
    // Create an instance of order created listener
    const listener = new OrderCreatedListener(natsWrapper.client);

    // Create a ticket
    const ticket = Ticket.build({
      title: 'test ticket',
      price: 10,
      userId: new ObjectId(),
    });
    await ticket.save();

    // Create a fake order created event data
    const data: OrderCreatedEvent['data'] = {
      id: new ObjectId().toHexString(),
      userId: new ObjectId().toHexString(),
      expiresAt: new Date().toDateString(),
      status: OrderStatus.Created,
      version: 0,
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    };

    // Create a fake message object
    // @ts-ignore
    const msg: Message = {
      ack: jest.fn(),
    };

    return { listener, data, msg };
  };

  it('throws error if ticket does not exist', async () => {
    const { listener, data, msg } = await setup();

    // create new data
    const newData = {
      ...data,
      ticket: {
        id: new ObjectId().toHexString(),
        price: 10,
      },
    };

    await expect(listener.onMessage(newData, msg)).rejects.toThrow(
      'Ticket not found'
    );
  });

  it('saves the order id to the ticket when an order is created', async () => {
    const { listener, data, msg } = await setup();

    // call the onMessage function with event data and msg object
    await listener.onMessage(data, msg);

    // Find the ticket
    const ticket = await Ticket.findById(data.ticket.id);

    // assert the orderId is saved to the ticket
    expect(ticket!.orderId).not.toBeNull();
    expect(ticket!.orderId!.toHexString()).toEqual(data.id);
  });

  it('acknowledges the message', async () => {
    const { listener, data, msg } = await setup();

    // call the onMessage function with event data and msg object
    await listener.onMessage(data, msg);

    // assert message is acknowledged
    expect(msg.ack).toHaveBeenCalled();
  });

  it('emits ticket updated event', async () => {
    const { listener, data, msg } = await setup();

    // call the onMessage function with event data and msg object
    await listener.onMessage(data, msg);

    // asserts the publisher function has been called
    expect(natsWrapper.client.publish).toHaveBeenCalled();

    // access the eventData passed to the publisher mock function
    const eventData = JSON.parse(
      (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    );

    // asserts publisher calls with correct event data
    expect(eventData.id).toEqual(data.ticket.id);
    expect(eventData.version).toEqual(data.version + 1);
  });
});
