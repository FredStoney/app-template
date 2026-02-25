import { config } from 'dotenv';
import { resolve } from 'path';
import type { Config } from 'drizzle-kit';

config({ path: resolve(process.cwd(), '../../.env') });

export default {
	schema: './schema.ts',
	out: './migrations',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DATABASE_URL!
	},
	// Optionally, if you want to organize migrations by feature
	verbose: true,
	strict: true
} satisfies Config;
