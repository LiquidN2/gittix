import { Types } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrderStatus } from '@hngittix/common';

import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Order } from '../../../models/order';

const { ObjectId } = Types;

describe('Event Listener: Order Created', () => {
  const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const data: OrderCreatedEvent['data'] = {
      id: new ObjectId().toHexString(),
      userId: new ObjectId().toHexString(),
      expiresAt: new Date().toDateString(),
      status: OrderStatus.Created,
      version: 0,
      ticket: {
        id: new ObjectId().toHexString(),
        price: 15,
      },
    };

    // @ts-ignore
    const msg: Message = {
      ack: jest.fn(),
    };

    return { listener, data, msg };
  };

  it('creates an order with the same id from event data in db', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id);
    expect(order).not.toBeNull();
  });

  it('acknowledges the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});
