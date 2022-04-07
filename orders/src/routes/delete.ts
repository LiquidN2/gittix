import { Router, Request, Response } from 'express';
import { param } from 'express-validator';
import { Types } from 'mongoose';
import { authenticate, NotFoundError } from '@hngittix/common';

import { Order } from '../models/order';

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

    const ticket = await Order.findOneAndDelete({
      id,
      userId: req.currentUser!.id,
    });
    if (!ticket) throw new NotFoundError('Order not found');

    res.status(200).send(ticket);
  }
);

export { router as deleteOrderRouter };
