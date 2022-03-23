import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import * as jose from 'jose';

import { BadRequestError } from '../errors/bad-request-error';
import { User } from '../models/user';
import { validateRequest } from '../middlewares/validate-request';
import { Password } from '../services/password';
import { createSecretKey } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_ISSUER = process.env.JWT_ISSUER as string;
const JWT_AUDIENCE = process.env.JWT_AUDIENCE as string;
const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME as string;

const router = express.Router();

router.post(
  '/api/users/signin',
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().notEmpty().withMessage('Password must not be empty'),
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Verify email & password
    const user = await User.findByEmail(email);
    const verifiedPassword = user
      ? await Password.compare(user.password, password)
      : false;
    if (!user || !verifiedPassword) {
      throw new BadRequestError('Invalid email and/or password');
    }

    // Generate JWT
    // Create a secret key of type KeyObject from a jwt secret
    const privateKey = createSecretKey(JWT_SECRET, 'utf-8');
    // Sign the key
    const userJwt = await new jose.SignJWT({ id: user._id, email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setIssuer(JWT_ISSUER)
      .setAudience(JWT_AUDIENCE)
      .setExpirationTime(JWT_EXPIRATION_TIME)
      .sign(privateKey);

    req.session = { jwt: userJwt };

    res.status(200).send('OK');
  }
);

export { router as signinRouter };
