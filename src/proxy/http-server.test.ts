import { config, initConfig } from '../config.js'
import { initLogger } from '../logger.js'

import { initHTTPServer, stopHTTPServer } from './http-server.js'
import * as routeMappings from './routes/route-mappings.js'

describe('HTTP server', () => {
	const port = 8001

	beforeEach(() => {
		initConfig()
		initLogger({ name: config.projectName })
	})

	it('Should initialize HTTP server', () => {
		const initRouteMappingsSpy = vi.spyOn(
			routeMappings,
			'initRouteMappings'
		)

		const server = initHTTPServer()

		expect(initRouteMappingsSpy).toHaveBeenCalledTimes(1)
		expect(initRouteMappingsSpy).toHaveBeenCalledWith()

		expect(server).toBeDefined()
		expect(server.listening).toBe(false)
		expect(server.address()).toBeNull()
	})

	it('Should start HTTP server', async () => {
		const server = initHTTPServer().listen(port)

		expect(server.listening).toBe(true)
		expect(server.address()).not.toBeNull()

		await stopHTTPServer(server)
	})

	it('Should stop HTTP server', async () => {
		const server = initHTTPServer().listen(port)

		expect(server.listening).toBe(true)
		expect(server.address()).not.toBeNull()

		await stopHTTPServer(server)

		expect(server.listening).toBe(false)
		expect(server.address()).toBeNull()
	})

	it('Should not stop HTTP server if not running', async () => {
		const server = initHTTPServer()

		expect(server.listening).toBe(false)
		expect(server.address()).toBeNull()

		await stopHTTPServer(server)

		expect(server.listening).toBe(false)
		expect(server.address()).toBeNull()
	})
})
