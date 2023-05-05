import { config, initConfig } from './config.js'
import { getRouteMappings } from './route-mappings.js'

describe('Route mappings', () => {
	beforeEach(() => {
		initConfig()
	})

	it('Should default to production hosts from config', () => {
		const routeMappings = getRouteMappings()

		expect(routeMappings).toHaveLength(5)
		expect(routeMappings.find(({ name }) => name === 'manager')).toEqual(
			expect.objectContaining({
				targetHost: config.managerHost,
				prefix: '/manager',
			})
		)
		expect(routeMappings.find(({ name }) => name === 'assets')).toEqual(
			expect.objectContaining({
				targetHost: config.assetsProxyHost,
				prefix: '/assets',
			})
		)
		expect(routeMappings.find(({ name }) => name === 'webWriter')).toEqual(
			expect.objectContaining({
				targetHost: config.webSdkWriterHost,
				prefix: '/web-writer',
			})
		)
		expect(routeMappings.find(({ name }) => name === 'sdkWriter')).toEqual(
			expect.objectContaining({
				targetHost: config.mobileSdkWriterHost,
				prefix: '/sdk-writer',
			})
		)
		expect(routeMappings.find(({ name }) => name === 'webSdk')).toEqual(
			expect.objectContaining({
				targetHost: config.webSdkHost,
				prefix: '/',
			})
		)
	})
})
