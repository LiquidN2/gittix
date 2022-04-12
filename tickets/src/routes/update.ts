import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, authenticate, NotFoundError } from '@hngittix/common';

import { validateTicket } from '../middlewares/validate-ticket-id';
import { validateTicketCreator } from '../middlewares/validate-ticket-creator';

import { natsWrapper } from '../nats-wrapper';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';

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
    // Get the ticket
    const { ticket } = req;

    // Get input data
    const { title, price } = req.body;

    if (!ticket) {
      throw new NotFoundError('Ticket not found');
    }

    // Update the ticket
    ticket.title = title;
    ticket.price = price;

    // Save the changes
    await ticket.save();

    // Publish event
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket._id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId.toString(),
      version: ticket.version,
    });

    // Response
    res.status(200).json(ticket);
  }
);

export { router as updateTicketRouter };
