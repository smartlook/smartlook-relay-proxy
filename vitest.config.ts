import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		include: ['./src/**/*.test.ts', './test/**/*.test.ts'],
		env: {
			NODE_ENV: 'test',
			LOG_LEVEL: 'error',
		},
		globals: true,
		restoreMocks: true,
		unstubEnvs: true,
		coverage: {
			provider: 'c8',
			include: ['src/**/*.ts'],
			all: true,
			lines: 80,
			functions: 80,
			branches: 80,
			statements: 80,
		},
	},
})
