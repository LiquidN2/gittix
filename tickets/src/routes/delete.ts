import { Router, Request, Response } from 'express';
import { authenticate, NotFoundError } from '@hngittix/common';

import { Ticket } from '../models/ticket';
import { validateTicket } from '../middlewares/validate-ticket-id';
import { validateTicketCreator } from '../middlewares/validate-ticket-creator';

import { TicketDeletedPublisher } from '../events/publishers/ticket-deleted-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = Router();

router.delete(
  '/api/tickets/:id',
  authenticate,
  validateTicket,
  validateTicketCreator,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findOneAndDelete({
      _id: req.ticket?.id,
      userId: req.currentUser?.id,
    });

    if (!ticket) throw new NotFoundError('Ticket not found');

    // Publish event
    await new TicketDeletedPublisher(natsWrapper.client).publish({
      id: ticket._id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId.toString(),
    });

    res.status(200).send({});
  }
);

export { router as deleteTicketRouter };
