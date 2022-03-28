import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import {
  BadRequestError,
  validateRequest,
  generateUserJwt,
} from '@hngittix/common';

import { User } from '../models/user';

const router = express.Router();

router.post(
  '/api/users/signup',
  body('email').isEmail().withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters'),
  validateRequest,
  async (req: Request, res: Response) => {
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
    const jwt = await generateUserJwt({ id: user._id, email: user.email });

    // Store JWT on session object
    req.session = { jwt };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
