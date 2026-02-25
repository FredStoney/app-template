import { json, error } from '@sveltejs/kit';
import Stripe from 'stripe';
import type { RequestHandler } from './$types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: '2026-01-28.clover'
});

export const POST: RequestHandler = async ({ locals, url }) => {
	const user = locals.user;
	if (!user) {
		error(401, 'Unauthorized');
	}

	const priceId = process.env.STRIPE_PRO_PRICE_ID;
	if (!priceId) {
		error(500, 'STRIPE_PRO_PRICE_ID is not configured');
	}

	const origin = url.origin;

	const session = await stripe.checkout.sessions.create({
		mode: 'subscription',
		line_items: [{ price: priceId, quantity: 1 }],
		success_url: `${origin}/billing/success`,
		cancel_url: `${origin}/pricing`,
		customer_email: user.email,
		metadata: { userId: user.id }
	});

	if (!session.url) {
		error(500, 'Failed to create Stripe Checkout Session');
	}

	return json({ url: session.url });
};
