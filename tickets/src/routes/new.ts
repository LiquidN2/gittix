import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { Types } from 'mongoose';

import {
  validateRequest,
  authenticate,
  UnauthorizedRequestError,
  BadRequestError,
} from '@hngittix/common';

import { Ticket } from '../models/ticket';

const { ObjectId } = Types;

const router = Router();

router.post(
  '/api/tickets',
  authenticate,
  body('title').trim().notEmpty().withMessage('Title must be valid'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  validateRequest,
  async (req: Request, res: Response) => {
    if (!req.currentUser?.id) throw new UnauthorizedRequestError();

    const userIdString = req.currentUser.id;

    if (
      typeof userIdString !== 'string' ||
      !ObjectId.isValid(userIdString) ||
      String(new ObjectId(userIdString)) !== userIdString
    ) {
      throw new BadRequestError('userId format must be mongo objectId');
    }
    const userId = new ObjectId(userIdString);

    const { title, price } = req.body;

    // Create a ticket
    const ticket = Ticket.build({
      title,
      price,
      userId,
    });
    await ticket.save();

    res.status(201).json(ticket);
  }
);

export { router as createTicketRouter };
