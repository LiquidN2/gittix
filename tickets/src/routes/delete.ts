import { Router, Request, Response } from 'express';
import {
  authenticate,
  BadRequestError,
  UnauthorizedRequestError,
  NotFoundError,
} from '@hngittix/common';

import { Ticket } from '../models/ticket';
import { validateTicket } from '../middlewares/validate-ticket-id';
import { validateTicketCreator } from '../middlewares/validate-ticket-creator';

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

    res.status(200).send({});
  }
);

export { router as deleteTicketRouter };
