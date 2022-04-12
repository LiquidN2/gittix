import { Router, Request, Response } from 'express';
import { param } from 'express-validator';
import { Types } from 'mongoose';
import {
  authenticate,
  NotFoundError,
  UnauthorizedRequestError,
} from '@hngittix/common';

import { Order } from '../models/order';

const router = Router();
const { ObjectId } = Types;

router.get(
  '/api/orders/:id',
  authenticate,
  param('id')
    .trim()
    .notEmpty()
    .custom((input: string) => ObjectId.isValid(input))
    .withMessage('ticket id must be valid'),
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const order = await Order.findById(id).populate('ticket');
    if (!order) throw new NotFoundError('Order not found');
    if (req.currentUser!.id !== order.userId.toString()) {
      throw new UnauthorizedRequestError();
    }

    res.status(200).send(order);
  }
);

export { router as showOrderRouter };
