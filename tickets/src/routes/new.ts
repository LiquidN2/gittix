import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { validateRequest, authenticate } from '@hngittix/common';

const router = express.Router();

router.post(
  '/api/tickets',
  body('title').trim().notEmpty().withMessage('Title must be valid'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  validateRequest,
  authenticate,
  (req: Request, res: Response) => {
    const { title, price } = req.body;

    res.status(201).json({});
  }
);

export { router as createTicketRouter };
