import { Router, Request, Response } from 'express';
import { authenticate } from '@hngittix/common';

import { Order } from '../models/order';

const router = Router();

router.get('/api/orders', authenticate, async (req: Request, res: Response) => {
  const orders = await Order.find({ userId: req.currentUser!.id }).populate(
    'ticket'
  );

  res.status(200).send(orders);
});

export { router as indexOrderRouter };
