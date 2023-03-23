import { config } from './config.js'
import { logger } from './logger.js'
import { initApp } from './proxy/index.js'

const PORT = config.get('proxy.port')

const start = (): void => {
	logger.info('Starting proxy...')

	const app = initApp()

	app.listen(PORT, () => {
		logger.info(`Proxy started on port ${PORT}`)
	})
}

start()
