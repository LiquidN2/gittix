import { Router, Request, Response } from 'express';
import { param } from 'express-validator';
import { Types } from 'mongoose';
import {
  authenticate,
  NotFoundError,
  OrderStatus,
  UnauthorizedRequestError,
} from '@hngittix/common';

import { Order } from '../models/order';
import { natsWrapper } from '../nats-wrapper';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';

const router = Router();
const { ObjectId } = Types;

router.delete(
  '/api/orders/:id',
  authenticate,
  param('id')
    .trim()
    .notEmpty()
    .custom((input: string) => ObjectId.isValid(input))
    .withMessage('ticket id must be valid'),
  async (req: Request, res: Response) => {
    const { id } = req.params;

    // Validate if order exists
    const order = await Order.findById(id).populate('ticket');
    if (!order) throw new NotFoundError('Order not found');

    // Validate if the request comes from the one who made the order
    if (order.userId.toString() !== req.currentUser!.id) {
      throw new UnauthorizedRequestError();
    }

    // Update the order status to 'canceled'
    order.status = OrderStatus.Cancelled;
    await order.save();

    // Emits order canceled event
    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id.toString(),
      userId: order.userId.toString(),
      expiresAt: order.expiresAt.toString(),
      status: order.status,
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      },
    });

    res.status(200).send(order);
  }
);

export { router as deleteOrderRouter };
