import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  authenticate,
  NotFoundError,
  BadRequestError,
} from '@hngittix/common';

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

    // check if ticket is reserved
    if (ticket.orderId) {
      throw new BadRequestError('Ticket is reserved. Update not allowed');
    }

    // Update the ticket
    ticket.title = title;
    ticket.price = price;

    // Save the changes
    const updatedTicket = await ticket.save();

    // Publish event
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: updatedTicket._id,
      title: updatedTicket.title,
      price: updatedTicket.price,
      userId: updatedTicket.userId.toString(),
      version: updatedTicket.version,
    });

    // Response
    res.status(200).json(updatedTicket);
  }
);

export { router as updateTicketRouter };
