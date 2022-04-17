import { Router, Request, Response } from 'express';
import { Types } from 'mongoose';
import { body } from 'express-validator';

import {
  authenticate,
  BadRequestError,
  NotFoundError,
  OrderStatus,
  UnauthorizedRequestError,
  validateRequest,
} from '@hngittix/common';
import { Order } from '../models/order';

const { ObjectId } = Types;
const router = Router();

router.post(
  '/api/payments',
  authenticate,
  body('token').trim().notEmpty().withMessage('Stripe token must be valid'),
  body('orderId')
    .trim()
    .notEmpty()
    .custom((input: string) => ObjectId.isValid(input))
    .withMessage('Order id must be valid'),
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    // Check if order exists
    const order = await Order.findById(orderId);
    if (!order) throw new NotFoundError('Order Not Found');

    // Check if request is from user who created the order
    if (order.userId.toHexString() !== req.currentUser!.id) {
      throw new UnauthorizedRequestError();
    }

    // Ensures that order is not yet cancelled
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Order is cancelled');
    }

    res.send({ success: true });
  }
);

export { router as newPaymentRouter };
