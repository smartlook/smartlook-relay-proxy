import { config } from './config'
import { logger } from './logger'
import { initApp } from './proxy'

const PORT = config.get('proxy.port')

const start = (): void => {
	logger.info('Starting proxy...')

	const app = initApp()

	app.listen(PORT, () => {
		logger.info(`Proxy started on port ${PORT}`)
	})
}

start()
