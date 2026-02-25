import { fail, redirect } from '@sveltejs/kit';
import { getActiveSubscription } from '$lib/subscription';
import { stripe } from '$lib/stripe.server';
import { db, user as userTable, subscription as subscriptionTable, eq } from '@boilerplate/db';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user!;

	return {
		user,
		subscription: await getActiveSubscription(user.id)
	};
};

export const actions: Actions = {
	cancelSubscription: async ({ locals }) => {
		const currentUser = locals.user;
		if (!currentUser) {
			return fail(401, { error: 'Unauthorized' });
		}

		const activeSub = await getActiveSubscription(currentUser.id);
		if (!activeSub) {
			return fail(400, { error: 'No active subscription found' });
		}

		await stripe.subscriptions.update(activeSub.stripeSubscriptionId, {
			cancel_at_period_end: true
		});

		await db
			.update(subscriptionTable)
			.set({ cancelAtPeriodEnd: true, updatedAt: new Date() })
			.where(eq(subscriptionTable.stripeSubscriptionId, activeSub.stripeSubscriptionId));

		return { success: true };
	},

	deleteAccount: async ({ locals }) => {
		const currentUser = locals.user;
		if (!currentUser) {
			return fail(401, { error: 'Unauthorized' });
		}

		const activeSub = await getActiveSubscription(currentUser.id);
		if (activeSub?.stripeSubscriptionId) {
			try {
				await stripe.subscriptions.cancel(activeSub.stripeSubscriptionId);
			} catch (err) {
				console.error('Failed to cancel Stripe subscription during account deletion:', err);
			}
		}

		await db.delete(userTable).where(eq(userTable.id, currentUser.id));

		redirect(302, '/auth/login');
	}
};
