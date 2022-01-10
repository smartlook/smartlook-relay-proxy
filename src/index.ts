import { config } from './config'
import { logger } from './logger'
import { initApp } from './proxy'

const start = (): void => {
	logger.info('Starting proxy...')
	const app = initApp()

	app.listen(config.get('proxy.port'))
	logger.info('Proxy started')
}

start()
