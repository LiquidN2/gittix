import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import * as jose from 'jose';
import { createSecretKey } from 'crypto';

import { RequestValidationError } from '../errors/request-validation-error';
import { BadRequestError } from '../errors/bad-request-error';
import { User } from '../models/user';

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';
const JWT_ISSUER = process.env.JWT_ISSUER || 'gittix:auth-srv:issuer';
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || 'gittix:auth-srv:audience';
const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME || '1d';

const router = express.Router();

router.post(
  '/api/users/signup',
  body('email').isEmail().withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters'),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;

    // Check for existing user
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    // Save the user to the database
    // Password hashing is done by mongoose middleware before saving the doc
    const user = User.build({ email, password });
    await user.save();

    // Generate JWT
    // Create a secret key of type KeyObject from a jwt secret
    const privateKey = createSecretKey(JWT_SECRET, 'utf-8');
    // Sign the key
    const userJwt = await new jose.SignJWT({ id: user.id, email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setIssuer(JWT_ISSUER)
      .setAudience(JWT_AUDIENCE)
      .setExpirationTime(JWT_EXPIRATION_TIME)
      .sign(privateKey);

    // Store JWT on session object
    req.session = { jwt: userJwt };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
