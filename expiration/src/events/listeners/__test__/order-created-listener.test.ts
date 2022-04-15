import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrderStatus } from '@hngittix/common';

import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { expirationQueue } from '../../../queues/expiration-queue';

// Create a partial mock or expirationQueue
jest.mock('../../../queues/expiration-queue', () => {
  const originalModule = jest.requireActual('../../../queues/expiration-queue');

  // mock the expirationQueue prop of the module
  const expirationQueue = {
    add: jest.fn(),
  };

  //Mock the export
  return {
    __esModule: true,
    ...originalModule,
    expirationQueue,
  };
});

describe('Event Listener: Order Created', () => {
  const delaySeconds = 15; // 15 secs;

  const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const expiresAt: Date | string = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + delaySeconds);

    const data: OrderCreatedEvent['data'] = {
      id: '6257ecb1f1caa3d8626812af',
      userId: '6257e4c15536f2ca67abf73c',
      expiresAt: expiresAt.toISOString(),
      status: OrderStatus.Created,
      version: 0,
      ticket: {
        id: '6257ecb5f97d88ee552c1b3b',
        price: 10,
      },
    };

    // @ts-ignore
    const msg: Message = {
      ack: jest.fn(),
    };

    return { listener, data, msg };
  };

  it('invokes expirationQueue.add function', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(expirationQueue.add).toHaveBeenCalled();
  });

  it('invokes expirationQueue.add function with correct parameters', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const [expirationMsgData, expirationMsgOpt] = (
      expirationQueue.add as jest.Mock
    ).mock.calls[0];

    expect(expirationMsgData.orderId).toEqual(data.id);
    expect(expirationMsgOpt.delay).toEqual(delaySeconds * 1000);
  });

  it('acknowledges the event', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
  });
});
