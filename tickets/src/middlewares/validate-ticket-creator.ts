import { Request, Response, NextFunction } from 'express';
import { UnauthorizedRequestError } from '@hngittix/common';

export const validateTicketCreator = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { currentUser, ticket } = req;

  // Check if the request is from the creator of the ticker
  if (currentUser?.id && ticket.userId.toString() !== currentUser.id) {
    throw new UnauthorizedRequestError();
  }

  next();
};
