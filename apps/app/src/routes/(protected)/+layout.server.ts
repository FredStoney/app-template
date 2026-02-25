import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		redirect(302, `/auth/login?returnTo=${encodeURIComponent(url.pathname)}`);
	}

	return { user: locals.user };
};
