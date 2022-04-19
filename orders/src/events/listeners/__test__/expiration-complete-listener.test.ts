import { Message } from 'node-nats-streaming';
import { Types } from 'mongoose';
import {
  ExpirationCompleteEvent,
  OrderStatus,
  Subjects,
} from '@hngittix/common';

import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import { Order } from '../../../models/order';

const { ObjectId } = Types;

describe('Event Listener: Expiration Complete', () => {
  const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client);

    // Create a ticket
    const ticket = Ticket.build({ title: 'test ticket', price: 10 });
    await ticket.save();

    // Create an order
    const order = Order.build({
      ticket: ticket.id,
      userId: new ObjectId(),
      expiresAt: new Date(),
      status: OrderStatus.Created,
    });
    await order.save();

    const data: ExpirationCompleteEvent['data'] = {
      orderId: order.id.toString(),
    };

    // @ts-ignore
    const msg: Message = {
      ack: jest.fn(),
    };

    return { listener, data, msg, order };
  };

  it('throws an error if order id is not valid', async () => {
    const { listener, msg } = await setup();

    await expect(
      listener.onMessage({ orderId: new ObjectId().toString() }, msg)
    ).rejects.toThrow('Order not found');
  });

  it('does not cancel order if order is already complete', async () => {
    const { listener, data, msg, order } = await setup();

    const testOrder = await Order.findById(order.id);
    testOrder!.status = OrderStatus.Complete;
    const completeOrder = await testOrder!.save();

    await listener.onMessage(data, msg);
    expect(completeOrder.status).not.toEqual(OrderStatus.Cancelled);
  });

  it('changes the order status to "cancelled"', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const order = await Order.findById(data.orderId);
    expect(order!.status).toEqual(OrderStatus.Cancelled);
  });

  it('emits order cancelled event', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    // asserts event publisher is invoked
    expect(natsWrapper.client.publish).toHaveBeenCalled();

    // access event name and data
    const [eventName, eventDataString] = (
      natsWrapper.client.publish as jest.Mock
    ).mock.calls[0];

    const eventData = JSON.parse(eventDataString);

    // assert event name is 'order:cancelled'
    expect(eventName).toEqual(Subjects.OrderCancelled);

    // assert event data is from the cancelled order
    expect(eventData.id).toEqual(data.orderId);
  });

  it('acknowledges the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});
