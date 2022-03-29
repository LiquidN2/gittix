import { Router, Request, Response } from 'express';
import { body } from 'express-validator';

import {
  validateRequest,
  authenticate,
  BadRequestError,
  UnauthorizedRequestError,
} from '@hngittix/common';
import { Ticket } from '../models/ticket';

const router = Router();

router.put(
  '/api/tickets/:id',
  authenticate,
  body('title').trim().notEmpty().withMessage('Title must be valid'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  validateRequest,
  async (req: Request, res: Response) => {
    const { id: ticketId } = req.params;

    // Validate ticket id & user id
    if (!req.currentUser?.id || !ticketId)
      throw new BadRequestError('Invalid user id or ticket id');

    // Check if ticket exists
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new BadRequestError('Invalid ticket id');

    // Only allows ticket creator to make update
    const requestUserId = req.currentUser.id as string;
    if (ticket.userId.toString() !== requestUserId)
      throw new UnauthorizedRequestError();

    // Update the ticket
    const { title, price } = req.body;
    ticket.title = title;
    ticket.price = price;

    await ticket.save();

    res.status(200).json(ticket);
  }
);

export { router as updateTicketRouter };
