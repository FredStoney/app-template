import { db, subscription, eq } from '@boilerplate/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user!;

	const existing = await db
		.select()
		.from(subscription)
		.where(eq(subscription.userId, user.id))
		.limit(1);

	const activeSub = existing.find((s) => s.status === 'active' || s.status === 'trialing');

	return {
		user,
		isSubscribed: !!activeSub
	};
};
