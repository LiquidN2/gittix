import { Types } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderStatus, PaymentCreatedEvent } from '@hngittix/common';

import { PaymentCreatedListener } from '../payment-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Order } from '../../../models/order';
import { Ticket } from '../../../models/ticket';

const { ObjectId } = Types;

const setup = async () => {
  const listener = new PaymentCreatedListener(natsWrapper.client);

  // Create a ticket
  const ticket = Ticket.build({
    title: 'test ticket',
    price: 10,
  });
  await ticket.save();

  // Create an order
  const order = Order.build({
    ticket,
    userId: new ObjectId(),
    expiresAt: new Date(),
    status: OrderStatus.Created,
  });
  await order.save();

  const data: PaymentCreatedEvent['data'] = {
    id: new ObjectId().toHexString(),
    orderId: order.id.toString(),
    stripeChargeId: 'dvasdvasdvasdv',
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order, ticket };
};

describe('Event Listener: Payment Created', () => {
  it('acknowledges the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });

  it('throws error if order does not exist', async () => {
    const { listener, data, msg } = await setup();

    await expect(
      listener.onMessage(
        { ...data, orderId: new ObjectId().toHexString() },
        msg
      )
    ).rejects.toThrow('Order not found');
  });

  it('throws error if order was cancelled', async () => {
    const { listener, data, msg, order } = await setup();

    // Change order status to cancelled
    const testCancel = await Order.findById(order.id);
    testCancel!.status = OrderStatus.Cancelled;
    await testCancel!.save();

    await expect(listener.onMessage(data, msg)).rejects.toThrow(
      'Cannot complete a cancelled order'
    );
  });

  it('changes the order status to complete', async () => {
    const { listener, data, msg, order } = await setup();

    await listener.onMessage(data, msg);

    const testOrder = await Order.findById(order.id);

    expect(testOrder!.status).toEqual(OrderStatus.Complete);
  });
});
