import { drizzle } from 'drizzle-orm/postgres-js';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from './schema';
export * from './schema';
export * from 'drizzle-orm';

type Schema = typeof schema;

let _db: PostgresJsDatabase<Schema> | undefined;

function getDb(): PostgresJsDatabase<Schema> {
	if (!_db) {
		if (!process.env.DATABASE_URL) {
			throw new Error('DATABASE_URL environment variable is not set');
		}
		_db = drizzle(process.env.DATABASE_URL, { schema });
	}
	return _db;
}

export const db = new Proxy({} as PostgresJsDatabase<Schema>, {
	get(_target, prop) {
		return getDb()[prop as keyof PostgresJsDatabase<Schema>];
	}
});
