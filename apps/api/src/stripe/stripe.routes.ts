import { Hono } from 'hono';
import type Stripe from 'stripe';
import { stripe } from '@lib/stripe';
import { db, subscription, user, eq } from '@boilerplate/db';

const app = new Hono();

app.post('/stripe', async (c) => {
	const sig = c.req.header('stripe-signature');
	const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

	if (!sig || !webhookSecret) {
		return c.json({ error: 'Missing stripe signature or webhook secret' }, 400);
	}

	const rawBody = await c.req.text();

	let event: Stripe.Event;
	try {
		event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
	} catch (err) {
		console.error('Webhook signature verification failed:', err);
		return c.json({ error: 'Invalid signature' }, 400);
	}

	try {
		switch (event.type) {
			case 'checkout.session.completed': {
				const session = event.data.object as Stripe.Checkout.Session;
				await handleCheckoutSessionCompleted(session);
				break;
			}
			case 'customer.subscription.updated': {
				const sub = event.data.object as Stripe.Subscription;
				await handleSubscriptionUpdated(sub);
				break;
			}
			case 'customer.subscription.deleted': {
				const sub = event.data.object as Stripe.Subscription;
				await handleSubscriptionUpdated(sub);
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

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
	const userId = session.metadata?.userId;
	if (!userId || !session.subscription || !session.customer) {
		console.warn('checkout.session.completed missing userId, subscription, or customer');
		return;
	}

	const customerId =
		typeof session.customer === 'string' ? session.customer : session.customer.id;
	const subscriptionId =
		typeof session.subscription === 'string' ? session.subscription : session.subscription.id;

	const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
	const firstItem = stripeSubscription.items.data[0];
	const priceId = firstItem?.price.id ?? '';
	const currentPeriodEnd = new Date((firstItem?.current_period_end ?? 0) * 1000);

	await db
		.insert(subscription)
		.values({
			id: crypto.randomUUID(),
			userId,
			stripeCustomerId: customerId,
			stripeSubscriptionId: subscriptionId,
			stripePriceId: priceId,
			status: stripeSubscription.status,
			currentPeriodEnd,
			createdAt: new Date(),
			updatedAt: new Date()
		})
		.onConflictDoUpdate({
			target: subscription.stripeSubscriptionId,
			set: {
				status: stripeSubscription.status,
				stripePriceId: priceId,
				currentPeriodEnd,
				updatedAt: new Date()
			}
		});

	await db
		.update(user)
		.set({ stripeCustomerId: customerId })
		.where(eq(user.id, userId));
}

async function handleSubscriptionUpdated(stripeSubscription: Stripe.Subscription) {
	const subscriptionId = stripeSubscription.id;
	const firstItem = stripeSubscription.items.data[0];
	const priceId = firstItem?.price.id ?? '';
	const currentPeriodEnd = new Date((firstItem?.current_period_end ?? 0) * 1000);

	await db
		.update(subscription)
		.set({
			status: stripeSubscription.status,
			stripePriceId: priceId,
			currentPeriodEnd,
			updatedAt: new Date()
		})
		.where(eq(subscription.stripeSubscriptionId, subscriptionId));
}

export { app as stripeRoutes };
