import express from 'express';
import cookieSession from 'cookie-session';
import 'express-async-errors';

import { NotFoundError, errorHandler } from '@hngittix/common';

import { indexTicketRouter } from './routes';
import { deleteTicketRouter } from './routes/delete';
import { createTicketRouter } from './routes/new';
import { updateTicketRouter } from './routes/update';
import { showTicketRouter } from './routes/show';

const app = express();

app.set('trust proxy', true);

// -----------------------
// GLOBAL MIDDLEWARES
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (!process.env.COOKIE_SESSION_NAME)
  throw new Error('COOKIE_SESSION_NAME must be defined');
app.use(
  cookieSession({
    name: process.env.COOKIE_SESSION_NAME,
    signed: false, // encryption to be handled by JWT
    secure: process.env.NODE_ENV !== 'test', // send cookie via HTTPS only
  })
);

// -----------------------
// ROUTE HANDLERS
// /api/tickets/:id
app.use(deleteTicketRouter);
app.use(updateTicketRouter);
app.use(showTicketRouter);

// /api/tickets
app.use(createTicketRouter);
app.use(indexTicketRouter);

// -----------------------
// ERROR HANDLERS
app.all('*', async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
