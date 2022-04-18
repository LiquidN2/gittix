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

import { stripe } from '../stripe';
import { Order } from '../models/order';
import { Payment } from '../models/payment';
import { natsWrapper } from '../nats-wrapper';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';

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

    // Create a Stripe charge
    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100, // convert to cents
      source: token,
      metadata: {
        orderId: order.id.toString(),
        userId: order.userId.toString(),
      },
    });

    if (!charge) throw new Error('Unable to create Stripe charge');

    // Create & save a payment record
    const payment = Payment.build({
      order: order.id,
      stripeChargeId: charge.id,
    });
    await payment.save();

    // Emits Payment Created event
    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id.toString(),
      orderId: payment.order.toString(),
      stripeChargeId: payment.stripeChargeId,
    });

    res.status(201).send({ id: payment.id });
  }
);

export { router as newPaymentRouter };
