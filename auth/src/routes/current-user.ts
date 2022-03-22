import express from 'express';

const router = express.Router();

router.get('/api/users/currentuser', (req, res) => {
  res.send('Returning the detail of the current user...');
});

export { router as currentUserRouter };
