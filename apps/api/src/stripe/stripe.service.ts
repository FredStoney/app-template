import type Stripe from 'stripe';
import { db as _db, subscription, user, eq } from '@boilerplate/db';

type Db = typeof _db;

interface ServiceDeps {
	stripe: Stripe;
	db: Db;
}

export async function handleCheckoutSessionCompleted(
	session: Stripe.Checkout.Session,
	{ stripe, db }: ServiceDeps
) {
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
			cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
			currentPeriodEnd,
			createdAt: new Date(),
			updatedAt: new Date()
		})
		.onConflictDoUpdate({
			target: subscription.stripeSubscriptionId,
			set: {
				status: stripeSubscription.status,
				cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
				stripePriceId: priceId,
				currentPeriodEnd,
				updatedAt: new Date()
			}
		});

	await db.update(user).set({ stripeCustomerId: customerId }).where(eq(user.id, userId));
}

export async function handleSubscriptionUpdated(
	stripeSubscription: Stripe.Subscription,
	{ db }: Pick<ServiceDeps, 'db'>
) {
	const subscriptionId = stripeSubscription.id;
	const firstItem = stripeSubscription.items.data[0];
	const priceId = firstItem?.price.id ?? '';
	const currentPeriodEnd = new Date((firstItem?.current_period_end ?? 0) * 1000);

	await db
		.update(subscription)
		.set({
			status: stripeSubscription.status,
			cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
			stripePriceId: priceId,
			currentPeriodEnd,
			updatedAt: new Date()
		})
		.where(eq(subscription.stripeSubscriptionId, subscriptionId));
}
