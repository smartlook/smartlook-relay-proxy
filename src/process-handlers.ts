import { Server } from 'http'

import { logger } from './logger.js'

export const registerProcessHandlers = (app: Server): void => {
	logger.debug('Registering process handlers')

	process.on('uncaughtException', (err) => {
		logger.error(err, 'Uncaught exception')
		process.emit('beforeExit', 1)
	})

	process.on('unhandledRejection', (err) => {
		logger.error(err, 'Unhandled rejection')
		process.emit('beforeExit', 1)
	})

	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	process.on('beforeExit', async (code) => {
		try {
			logger.debug({ code }, 'Received beforeExit')

			logger.debug('Server started shutting down')

			await new Promise<void>((resolve, reject) => {
				app.close((err) => {
					if (err) {
						reject(err)
					} else {
						resolve()
					}
				})
			})

			logger.debug('Server has been shut down')
		} catch (e) {
			logger.error(e, 'Error during beforeExit hook')
		} finally {
			process.exit(code)
		}
	})

	process.on('SIGTERM', () => {
		logger.debug('Received SIGTERM')
		process.emit('beforeExit', 0)
	})

	process.on('SIGINT', () => {
		logger.debug('Received SIGTERM')
		process.emit('beforeExit', 0)
	})

	logger.debug('Process handlers registered')
}
