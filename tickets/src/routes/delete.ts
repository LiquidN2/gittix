import { Router, Request, Response } from 'express';
import {
  authenticate,
  BadRequestError,
  UnauthorizedRequestError,
} from '@hngittix/common';

import { Ticket } from '../models/ticket';

const router = Router();

router.delete(
  '/api/tickets/:id',
  authenticate,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { currentUser } = req;

    if (!id) {
      throw new BadRequestError('Ticket id must be valid');
    }

    if (!currentUser?.id) {
      throw new UnauthorizedRequestError();
    }

    const ticket = await Ticket.findOneAndDelete({
      _id: id,
      userId: currentUser.id,
    });
    if (!ticket) {
      throw new BadRequestError(
        'Ticket does not exist or you do not have the right to delete it'
      );
    }

    res.status(200).send({});
  }
);

export { router as deleteTicketRouter };
