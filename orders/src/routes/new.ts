import { Request, Response, Router } from 'express';
import { Types } from 'mongoose';
import { body } from 'express-validator';
import {
  authenticate,
  BadRequestError,
  NotFoundError,
  UnauthorizedRequestError,
  OrderStatus,
  validateRequest,
} from '@hngittix/common';

import { Ticket } from '../models/ticket';
import { Order } from '../models/order';

import { natsWrapper } from '../nats-wrapper';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';

const EXPIRATION_WINDOW_SECONDS = 5; // 15 minutes
const router = Router();
const { ObjectId } = Types;

router.post(
  '/api/orders',
  authenticate,
  body('ticketId')
    .trim()
    .notEmpty()
    .custom((input: string) => ObjectId.isValid(input))
    .withMessage('Ticket id must be valid'),
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Check if ticket exists
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new NotFoundError('Ticket not found');

    // Check if ticket is reserved (ticket is associated with an order with status not 'cancelled')
    const isReserved = await ticket.isReserved();
    if (isReserved) throw new BadRequestError('Ticket is reserved');

    // Calculate expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Create the order and save to db
    if (typeof req.currentUser?.id !== 'string') {
      throw new UnauthorizedRequestError();
    }
    const userId = req.currentUser.id;

    const order = Order.build({
      ticket,
      status: OrderStatus.Created,
      expiresAt: expiration,
      userId: new ObjectId(userId),
    });

    await order.save();

    // Publish event
    await new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id.toString(),
      userId: order.userId.toString(),
      expiresAt: order.expiresAt.toISOString(),
      status: order.status,
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
      version: order.version,
    });

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
