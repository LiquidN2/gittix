import { Request, Response, NextFunction } from 'express';

import { verifyUserJwt } from '../services/jwt';
import { ForbiddenRequestError } from '../errors/forbidden-request-error';

declare module 'express-serve-static-core' {
  interface Request {
    currentUser?: any;
  }
}

export const authenticate = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  req.currentUser = null;

  // Check if the cookie contains jwt
  if (!req.session?.jwt) throw new ForbiddenRequestError();

  // Check if jwt can be verified
  const payload = await verifyUserJwt(req.session.jwt);
  if (!payload?.id) throw new ForbiddenRequestError();

  req.currentUser = payload;

  next();
};
