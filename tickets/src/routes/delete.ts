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
    // const { id } = req.params;
    // const { currentUser } = req;
    //
    // if (!id) {
    //   throw new BadRequestError('Ticket id must be valid');
    // }
    //
    // if (!currentUser?.id) {
    //   throw new UnauthorizedRequestError();
    // }

    const ticket = await Ticket.findOneAndDelete({
      _id: req.ticket.id,
      userId: req.currentUser?.id,
    });

    if (!ticket) throw new NotFoundError();

    res.status(200).send({});
  }
);

export { router as deleteTicketRouter };
