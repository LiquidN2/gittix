import { Router, Request, Response } from 'express';

const router = Router();

router.get('/api/orders', async (req: Request, res: Response) => {
  // const tickets = await Ticket.find({});
  // res.status(200).send({ tickets: tickets || [] });
  res.status(200).send({});
});

export { router as indexOrderRouter };
