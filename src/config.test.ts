import { config, initConfig } from './config.js'
import { ConfigError } from './errors/index.js'

describe('Config', () => {
	it('Should initialize config', () => {
		initConfig()

		expect(config).toBeDefined()
	})

	it('Should not fail when initialized twice', () => {
		initConfig()
		initConfig()

		expect(config).toBeDefined()
	})

	it('Should default to production values', () => {
		initConfig()

		expect(config).toBeDefined()
		expect(config.projectName).toBe('smartlook-relay-proxy')
		expect(config.port).toBe(8000)
		expect(config.webSdkHost).toBe('https://web-sdk.smartlook.com')
		expect(config.assetsProxyHost).toBe(
			'https://assets-proxy.smartlook.cloud'
		)
		expect(config.webSdkWriterHost).toBe(
			'https://web-writer.eu.smartlook.cloud'
		)
		expect(config.mobileSdkWriterHost).toBe(
			'https://sdk-writer.eu.smartlook.cloud'
		)
		expect(config.managerHost).toBe('https://manager.eu.smartlook.cloud')
	})

	it('Should throw validation error', () => {
		vi.stubEnv('LOGGER_LEVEL', '123')

		try {
			initConfig()

			assert(false, 'Should throw error by now')
		} catch (err) {
			if (err instanceof ConfigError) {
				expect(err.isOperational).toBe(false)
				expect(err.issues.length).toBeGreaterThanOrEqual(1)
				expect(err.issues[0]).toHaveProperty('received')
				expect(err.issues[0]).toHaveProperty('code')
				expect(err.issues[0]).toHaveProperty('message')
				expect(err.issues[0]).toHaveProperty('path')
			} else {
				assert(false, 'Should throw ConfigError')
			}
		}
	})
})
