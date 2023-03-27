import { Server } from 'http'

import { logger } from './logger.js'
import { stopHTTPServer } from './proxy/http-server.js'

export function registerProcessHandlers(server: Server): void {
	logger.debug('Registering process handlers')

	process.on('uncaughtException', (err) => {
		logger.fatal(err, 'Uncaught exception')
		process.emit('beforeExit', 1)
	})

	process.on('unhandledRejection', (err) => {
		logger.fatal(err, 'Unhandled rejection')
		process.emit('beforeExit', 1)
	})

	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	process.on('beforeExit', async (code) => {
		try {
			logger.debug({ code }, 'Received beforeExit')

			logger.debug('Server started shutting down')

			await stopHTTPServer(server)

			logger.debug('Server has been shut down')
		} catch (e) {
			logger.fatal(e, 'Error during beforeExit hook')
		} finally {
			process.exit(code)
		}
	})

	process.on('SIGTERM', () => {
		logger.debug('Received SIGTERM')
		process.emit('beforeExit', 0)
	})

	process.on('SIGINT', () => {
		logger.debug('Received SIGINT')
		process.emit('beforeExit', 0)
	})

	logger.debug('Process handlers registered')
}
