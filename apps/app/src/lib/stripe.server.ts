import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';

const STRIPE_API_VERSION = '2026-01-28.clover' as const;

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
	apiVersion: STRIPE_API_VERSION
});
