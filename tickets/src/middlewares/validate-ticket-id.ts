// import { Request, Response, NextFunction } from 'express';
// import { BadRequestError, UnauthorizedRequestError } from '@hngittix/common';
// import { Ticket, TicketDoc } from '../models/ticket';
//
// declare global {
//   namespace Express {
//     interface Request {
//       ticket: TicketDoc;
//     }
//   }
// }
//
// export const validateTicketId = async (
//   req: Request,
//   _: Response,
//   next: NextFunction
// ) => {
//   const { id: ticketId } = req.params;
//
//   if (!req.currentUser?.id || !ticketId)
//     throw new BadRequestError('Invalid user id or ticket id');
//
//   const ticket = await Ticket.findById(ticketId);
//
//   if (!ticket) throw new BadRequestError('Invalid ticket id');
//
//   const requestUserId = req.currentUser.id as string;
//   if (ticket.userId.toString() !== requestUserId)
//     throw new UnauthorizedRequestError();
//
//   req.ticket = ticket;
//
//   next();
// };
