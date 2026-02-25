import { db, subscription, eq, and, inArray, ACTIVE_SUBSCRIPTION_STATUSES } from '@boilerplate/db';

export async function getActiveSubscription(userId: string) {
	const rows = await db
		.select()
		.from(subscription)
		.where(and(eq(subscription.userId, userId), inArray(subscription.status, ACTIVE_SUBSCRIPTION_STATUSES)))
		.limit(1);

	return rows[0] ?? null;
}
