import { Request, Response, NextFunction } from 'express';
import * as jose from 'jose';

import { verifyUserJwt, UserPayLoad } from '../services/jwt';
import { UnauthorizedRequestError } from '../errors/unauthorized-request-error';

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayLoad | jose.JWTPayload;
    }
  }
}

export const authenticate = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  // Check if the cookie contains jwt
  if (!req.session?.jwt) throw new UnauthorizedRequestError();

  // Check if jwt can be verified
  const payload = (await verifyUserJwt(req.session.jwt)) as UserPayLoad;
  if (!payload?.id) throw new UnauthorizedRequestError();

  req.currentUser = payload;

  next();
};
