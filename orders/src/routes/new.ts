import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { authenticate, validateRequest } from '@hngittix/common';

const router = Router();

router.post(
  '/api/orders',
  authenticate,
  body('ticketId').trim().notEmpty().withMessage('Ticket id must be valid'),
  validateRequest,
  async (req: Request, res: Response) => {
    res.status(201).send({});
  }
);

export { router as createOrderRouter };
