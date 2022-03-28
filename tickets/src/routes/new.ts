import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { validateRequest, authenticate } from '@hngittix/common';

const router = express.Router();

router.post(
  '/api/tickets',
  body('title').trim().notEmpty().withMessage('Title of ticket must be valid'),
  body('price').trim().notEmpty().withMessage('Price must be valid'),
  validateRequest,
  authenticate,
  (req: Request, res: Response) => {
    const { title, price } = req.body;

    res.status(201).json({});
  }
);

export { router as newTicketRouter };
