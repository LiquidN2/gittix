import express from 'express';

import { currentUserRouter } from './routes/current-user';
import { signupRouter } from './routes/signup';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(currentUserRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅✅✅ AUTH SERVICE is listening on port ${PORT} ✅✅✅`);
});
