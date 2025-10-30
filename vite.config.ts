import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig(() => {
	return {
		plugins: [sveltekit(), tailwindcss()],
		server: {
			host: '0.0.0.0',
			allowedHosts: ['.electris.net']
		},
		preview: {
			host: '0.0.0.0',
			allowedHosts: ['.electris.net']
		}
	};
});