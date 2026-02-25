import { z } from 'zod';

// Load .env only in local development — Lambda injects env vars at runtime
if (process.env.NODE_ENV !== 'production') {
	const { config } = await import('dotenv');
	const { fileURLToPath } = await import('url');
	const { dirname, resolve } = await import('path');
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = dirname(__filename);
	config({ path: resolve(__dirname, '../../../.env') });
}

const envSchema = z.object({
	DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
	STRIPE_SECRET_KEY: z.string().min(1, 'STRIPE_SECRET_KEY is required'),
	STRIPE_WEBHOOK_SECRET: z.string().min(1, 'STRIPE_WEBHOOK_SECRET is required'),
	PORT: z.coerce.number().default(3001)
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
	console.error('Invalid environment variables:');
	for (const issue of parsed.error.issues) {
		console.error(`  ${issue.path.join('.')}: ${issue.message}`);
	}
	process.exit(1);
}

export const env = parsed.data;
