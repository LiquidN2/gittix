import { Router, Request, Response } from 'express';

import { validateTicket } from '../middlewares/validate-ticket-id';
import { NotFoundError } from '@hngittix/common';

const router = Router();

router.get(
  '/api/tickets/:id',
  validateTicket,
  (req: Request, res: Response) => {
    if (!req.ticket) {
      throw new NotFoundError('Ticket not found');
    }

    res.status(200).send({ ticket: req.ticket });
  }
);

export { router as showTicketRouter };
