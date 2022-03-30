import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  authenticate,
  BadRequestError,
  UnauthorizedRequestError,
} from '@hngittix/common';

import { Ticket } from '../models/ticket';
import { validateTicket } from '../middlewares/validate-ticket-id';
import { validateTicketCreator } from '../middlewares/validate-ticket-creator';

const router = Router();

router.put(
  '/api/tickets/:id',
  authenticate,
  body('title').trim().notEmpty().withMessage('Title must be valid'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  validateRequest,
  validateTicket,
  validateTicketCreator,
  async (req: Request, res: Response) => {
    // const { id: ticketId } = req.params;
    //
    // // Validate ticket id & user id
    // if (!req.currentUser?.id || !ticketId)
    //   throw new BadRequestError('Invalid user id or ticket id');
    //
    // // Check if ticket exists
    // const ticket = await Ticket.findById(ticketId);
    // if (!ticket) throw new BadRequestError('Invalid ticket id');
    //
    // // Only allows ticket creator to make update
    // const requestUserId = req.currentUser.id as string;
    // if (ticket.userId.toString() !== requestUserId)
    //   throw new UnauthorizedRequestError();

    // Get the ticket
    const { ticket } = req;

    // Get input data
    const { title, price } = req.body;

    // Update the ticket
    ticket.title = title;
    ticket.price = price;

    // Save the changes
    await ticket.save();

    // Response
    res.status(200).json(ticket);
  }
);

export { router as updateTicketRouter };
