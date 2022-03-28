import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import {
  BadRequestError,
  validateRequest,
  generateUserJwt,
} from '@hngittix/common';

import { User } from '../models/user';

import { Password } from '../services/password';

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
    const jwt = await generateUserJwt({ id: user._id, email: user.email });

    // Store JWT in session object
    req.session = { jwt };

    res.status(200).send(user);
  }
);

export { router as signinRouter };
