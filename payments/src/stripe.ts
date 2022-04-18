import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY)
  throw new Error('STRIPE_SECRET_KEY must be define');

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});
