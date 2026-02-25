import { getActiveSubscription } from '$lib/subscription';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user!;

	return {
		user,
		isSubscribed: !!(await getActiveSubscription(user.id))
	};
};
