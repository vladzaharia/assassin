/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	cacheDir: '../node_modules/.vite/app',
	base: '/',

	server: {
		port: 4200,
		host: 'localhost',
		fs: {
			allow: ['../'],
		},
	},

	preview: {
		port: 4300,
		host: 'localhost',
	},

	plugins: [
		react(),
		viteTsConfigPaths({
			root: '../',
		}),
	],

	// Uncomment this if you are using workers.
	// worker: {
	//  plugins: [
	//    viteTsConfigPaths({
	//      root: '../',
	//    }),
	//  ],
	// },

	test: {
		globals: true,
		cache: {
			dir: '../node_modules/.vitest',
		},
		environment: 'jsdom',
		include: ['./src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		coverage: {
			reporter: ['json-summary', 'json']
		},
		reporters: ['default', 'junit'],
		outputFile: {
			junit: '../coverage/assassin-app/junit.xml',
		}
	},
})
