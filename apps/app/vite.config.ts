import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';

const monorepoRoot = resolve(__dirname, '../../');

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, monorepoRoot, '');
	Object.assign(process.env, env);

	return {
		plugins: [tailwindcss(), sveltekit()],
		envDir: monorepoRoot
	};
});
