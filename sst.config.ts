/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
	app(input) {
		return {
			name: 'app-template',
			// Retain resources on removal in production to avoid accidental data loss
			removal: input?.stage === 'production' ? 'retain' : 'remove',
			protect: ['production'].includes(input?.stage),
			home: 'aws',
			providers: {
				aws: { profile: 'app-template' }
			}
		};
	},
	async run() {
		// Secrets — set values once via: npx sst secret set <Name> <value>
		const databaseUrl = new sst.Secret('DatabaseUrl');
		const betterAuthSecret = new sst.Secret('BetterAuthSecret');
		const betterAuthUrl = new sst.Secret('BetterAuthUrl');
		const googleClientId = new sst.Secret('GoogleClientId');
		const googleClientSecret = new sst.Secret('GoogleClientSecret');
		const stripeSecretKey = new sst.Secret('StripeSecretKey');
		const stripeWebhookSecret = new sst.Secret('StripeWebhookSecret');

		// Hono API Lambda — only needs DB + Stripe secrets
		const api = new sst.aws.Function('Api', {
			handler: 'apps/api/src/lambda.handler',
			runtime: 'nodejs22.x',
			url: true,
			link: [databaseUrl, stripeSecretKey, stripeWebhookSecret],
			environment: {
				DATABASE_URL: databaseUrl.value,
				STRIPE_SECRET_KEY: stripeSecretKey.value,
				STRIPE_WEBHOOK_SECRET: stripeWebhookSecret.value,
				NODE_ENV: 'production'
			}
		});

		// SvelteKit frontend Lambda — needs all secrets (auth, OAuth, DB, Stripe)
		const web = new sst.aws.SvelteKit('Web', {
			path: 'apps/app',
			link: [
				databaseUrl,
				betterAuthSecret,
				betterAuthUrl,
				googleClientId,
				googleClientSecret,
				stripeSecretKey
			],
			environment: {
				DATABASE_URL: databaseUrl.value,
				BETTER_AUTH_SECRET: betterAuthSecret.value,
				BETTER_AUTH_URL: betterAuthUrl.value,
				GOOGLE_CLIENT_ID: googleClientId.value,
				GOOGLE_CLIENT_SECRET: googleClientSecret.value,
				STRIPE_SECRET_KEY: stripeSecretKey.value,
				PUBLIC_API_URL: api.url,
				NODE_ENV: 'production'
			}
		});

		return {
			api: api.url,
			web: web.url
		};
	}
});
