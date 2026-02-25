import { getActiveSubscription } from '$lib/subscription';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user!;

	return {
		user,
		subscription: await getActiveSubscription(user.id)
	};
};
