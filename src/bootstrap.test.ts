import { bootstrap } from './bootstrap.js'
import { config, initConfig } from './config.js'
import { initLogger } from './logger.js'

describe('HTTP server', () => {
    beforeEach(() => {
        initConfig()
        initLogger()
    })

    it('Should return 200 on /status', async () => {
        const server = await bootstrap()

        const response = await server.inject({
            method: 'GET',
            url: '/status',
        })

        const json = response.json<{
            app: string
            version: string
        }>()

        expect(response.statusCode).toBe(200)
        expect(json).toEqual({
            app: config.appName,
            version: config.commitSha,
        })
    })
})
