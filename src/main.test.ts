import { Server } from 'http'

import * as config from './config.js'
import * as logger from './logger.js'
import { main } from './main.js'
import * as processHandlers from './process-handlers.js'
import * as httpServer from './proxy/http-server.js'

describe('Main', () => {
	it('Should start the app', () => {
		const initConfigSpy = vi.spyOn(config, 'initConfig')
		const initLoggerSpy = vi.spyOn(logger, 'initLogger')
		const initHTTPServerSpy = vi
			.spyOn(httpServer, 'initHTTPServer')
			.mockImplementation(() => {
				return {
					listen: (port: number): void => {
						expect(port).toBe(config.config.port)
					},
				} as Server
			})

		const registerProcessHandlersSpy = vi.spyOn(
			processHandlers,
			'registerProcessHandlers'
		)

		main()

		expect(initConfigSpy).toHaveBeenCalledOnce()
		expect(initLoggerSpy).toHaveBeenCalledOnce()
		expect(initHTTPServerSpy).toHaveBeenCalledOnce()
		expect(registerProcessHandlersSpy).toHaveBeenCalledOnce()
	})
})
