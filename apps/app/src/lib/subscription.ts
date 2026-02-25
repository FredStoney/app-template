import { db, subscription, eq } from '@boilerplate/db';

const ACTIVE_STATUSES = ['active', 'trialing'] as const;

export async function getActiveSubscription(userId: string) {
	const rows = await db
		.select()
		.from(subscription)
		.where(eq(subscription.userId, userId))
		.limit(1);

	return rows.find((s) => (ACTIVE_STATUSES as readonly string[]).includes(s.status)) ?? null;
}
