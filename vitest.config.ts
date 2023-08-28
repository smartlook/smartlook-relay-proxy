import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        include: ['./test/**/*.test.ts'],
        env: {
            APP_NAME: 'smartlook-relay-proxy',
            COMMIT_SHA: 'dev',
        },
        globals: true,
        restoreMocks: true,
        unstubEnvs: true,
    },
})
