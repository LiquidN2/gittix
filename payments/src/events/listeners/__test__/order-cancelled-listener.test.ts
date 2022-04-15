import { Types } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent, OrderStatus } from '@hngittix/common';

import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Order } from '../../../models/order';

const { ObjectId } = Types;

describe('Event Listener: Order Created', () => {
  const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    // create an order
    const order = Order.build({
      id: new ObjectId(),
      userId: new ObjectId(),
      status: OrderStatus.Created,
      price: 15,
      version: 0,
    });
    await order.save();

    const data: OrderCancelledEvent['data'] = {
      id: order.id.toString(),
      userId: order.userId.toString(),
      expiresAt: new Date().toDateString(),
      status: OrderStatus.Cancelled,
      version: 1,
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

  it('throws error if order is invalid', async () => {
    const { listener, data, msg } = await setup();

    await expect(
      listener.onMessage({ ...data, version: 2 }, msg)
    ).rejects.toThrow('Order not found');
  });

  it('updates the order status to "cancelled"', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id);
    expect(order).not.toBeNull();
    expect(order!.status).toEqual(OrderStatus.Cancelled);
  });

  it('acknowledges the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});
