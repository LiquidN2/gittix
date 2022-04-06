import { Router, Request, Response } from 'express';
import { authenticate } from '@hngittix/common';

const router = Router();

router.delete(
  '/api/orders/:id',
  authenticate,
  (req: Request, res: Response) => {
    // if (!req.ticket) {
    //   throw new NotFoundError('Ticket not found');
    // }
    //
    // res.status(200).send({ ticket: req.ticket });
    res.status(200).send({});
  }
);

export { router as deleteOrderRouter };
