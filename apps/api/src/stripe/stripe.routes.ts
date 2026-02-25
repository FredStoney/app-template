import { Hono } from 'hono';
import type Stripe from 'stripe';
import { stripe } from '@lib/stripe';
import { env } from '../env.js';
import { db } from '@boilerplate/db';
import { handleCheckoutSessionCompleted, handleSubscriptionUpdated } from './stripe.service';

const app = new Hono();

const deps = { stripe, db };

app.post('/stripe', async (c) => {
	const sig = c.req.header('stripe-signature');

	if (!sig) {
		return c.json({ error: 'Missing stripe-signature header' }, 400);
	}

	const rawBody = await c.req.text();

	let event: Stripe.Event;
	try {
		event = stripe.webhooks.constructEvent(rawBody, sig, env.STRIPE_WEBHOOK_SECRET);
	} catch (err) {
		console.error('Webhook signature verification failed:', err);
		return c.json({ error: 'Invalid signature' }, 400);
	}

	try {
		switch (event.type) {
			case 'checkout.session.completed': {
				const session = event.data.object as Stripe.Checkout.Session;
				await handleCheckoutSessionCompleted(session, deps);
				break;
			}
			case 'customer.subscription.updated':
			case 'customer.subscription.deleted': {
				const sub = event.data.object as Stripe.Subscription;
				await handleSubscriptionUpdated(sub, deps);
				break;
			}
			default:
				break;
		}
	} catch (err) {
		console.error(`Error handling webhook event ${event.type}:`, err);
		return c.json({ error: 'Webhook handler failed' }, 500);
	}

	return c.json({ received: true });
});

export { app as stripeRoutes };
