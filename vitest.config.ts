import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["**/*.test.ts", "**/*.spec.ts", "apps/**/*.test.ts", "packages/**/*.test.ts"],
		globals: true,
	},
});
