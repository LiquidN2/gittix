import { Router, Request, Response } from 'express';

const router = Router();

router.get('/api/orders/:id', (req: Request, res: Response) => {
  // if (!req.ticket) {
  //   throw new NotFoundError('Ticket not found');
  // }
  //
  // res.status(200).send({ ticket: req.ticket });
  res.status(200).send({});
});

export { router as showOrderRouter };
