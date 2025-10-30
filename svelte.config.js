import auto from '@sveltejs/adapter-auto';
import cloudflare from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		vitePreprocess()
	],

	kit: {
		adapter: auto(),
		prerender: {
        origin: 'http://localhost:4173'
      }
	}
};

export default config;