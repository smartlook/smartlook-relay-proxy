import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		include: ['./src/**/*.test.ts', './test/**/*.test.ts'],
		env: {
			NODE_ENV: 'test',
			LOGGER_LEVEL: 'error',
			COMMIT_SHA: 'test',
		},
		globals: true,
		restoreMocks: true,
		unstubEnvs: true,
		coverage: {
			provider: 'c8',
			include: ['src/**/*.ts'],
			exclude: ['src/**/types.ts', 'src/**/*.test.ts'],
			all: true,
		},
	},
})
