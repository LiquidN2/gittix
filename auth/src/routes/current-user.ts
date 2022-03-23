import express, { Request, Response } from 'express';

import { authenticate } from '../middlewares/authenticate';

const router = express.Router();

router.get(
  '/api/users/currentuser',
  authenticate,
  (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };
