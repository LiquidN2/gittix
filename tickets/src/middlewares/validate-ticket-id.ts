import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { BadRequestError, NotFoundError } from '@hngittix/common';

import { Ticket, TicketDoc } from '../models/ticket';

declare global {
  namespace Express {
    interface Request {
      ticket: TicketDoc;
    }
  }
}

const { ObjectId } = Types;

export const validateTicket = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { id: ticketId } = req.params;

  // ticket id must not be empty
  if (!ticketId) {
    throw new BadRequestError('Invalid ticket id');
  }

  // ticket id must be of valid mongodb object id format
  const isValidMongoObjetId =
    ObjectId.isValid(ticketId) &&
    new ObjectId(ticketId).toString() === ticketId;

  if (!isValidMongoObjetId) {
    throw new BadRequestError('Invalid ticket id');
  }

  // check if ticket exists
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new NotFoundError();
  }

  req.ticket = ticket;

  next();
};
